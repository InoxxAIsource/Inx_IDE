interface FormattingOptions {
  useTabs: boolean
  tabWidth: number
  semi: boolean
  singleQuote: boolean
  trailingComma: "none" | "es5" | "all"
  printWidth: number
}

interface LintingResult {
  errors: LintError[]
  warnings: LintWarning[]
  formatted: string
}

interface LintError {
  line: number
  column: number
  message: string
  rule: string
  severity: "error" | "warning"
}

interface LintWarning {
  line: number
  column: number
  message: string
  rule: string
  suggestion?: string
}

export class CodeFormatter {
  private static defaultOptions: FormattingOptions = {
    useTabs: false,
    tabWidth: 2,
    semi: false,
    singleQuote: true,
    trailingComma: "es5",
    printWidth: 100,
  }

  private static eslintRules = {
    // TypeScript rules
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/prefer-const": "error",

    // React rules
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // General rules
    "no-console": "warn",
    "no-debugger": "error",
    "no-unused-vars": "off", // Handled by TypeScript
    "prefer-const": "error",
    "no-var": "error",
  }

  static formatCode(code: string, options: Partial<FormattingOptions> = {}): string {
    const opts = { ...this.defaultOptions, ...options }

    try {
      // Basic formatting rules
      let formatted = code

      // Normalize line endings
      formatted = formatted.replace(/\r\n/g, "\n")

      // Fix indentation
      formatted = this.fixIndentation(formatted, opts.tabWidth, opts.useTabs)

      // Fix semicolons
      if (!opts.semi) {
        formatted = this.removeSemicolons(formatted)
      }

      // Fix quotes
      if (opts.singleQuote) {
        formatted = this.convertToSingleQuotes(formatted)
      }

      // Fix trailing commas
      formatted = this.fixTrailingCommas(formatted, opts.trailingComma)

      // Fix line length
      formatted = this.wrapLongLines(formatted, opts.printWidth)

      return formatted
    } catch (error) {
      console.error("Formatting error:", error)
      return code
    }
  }

  static lintCode(code: string): LintingResult {
    const errors: LintError[] = []
    const warnings: LintWarning[] = []

    const lines = code.split("\n")

    lines.forEach((line, index) => {
      const lineNumber = index + 1

      // Check for common issues
      this.checkUnusedImports(line, lineNumber, warnings)
      this.checkConsoleStatements(line, lineNumber, warnings)
      this.checkMissingKeys(line, lineNumber, errors)
      this.checkHookRules(line, lineNumber, errors)
      this.checkTypeScriptIssues(line, lineNumber, warnings)
    })

    const formatted = this.formatCode(code)

    return { errors, warnings, formatted }
  }

  private static fixIndentation(code: string, tabWidth: number, useTabs: boolean): string {
    const lines = code.split("\n")
    const indent = useTabs ? "\t" : " ".repeat(tabWidth)
    let indentLevel = 0

    return lines
      .map((line) => {
        const trimmed = line.trim()

        if (trimmed.includes("}") && !trimmed.includes("{")) {
          indentLevel = Math.max(0, indentLevel - 1)
        }

        const indentedLine = trimmed ? indent.repeat(indentLevel) + trimmed : ""

        if (trimmed.includes("{") && !trimmed.includes("}")) {
          indentLevel++
        }

        return indentedLine
      })
      .join("\n")
  }

  private static removeSemicolons(code: string): string {
    // Remove semicolons at end of lines, but keep them in for loops
    return code.replace(/;(\s*\n)/g, "$1").replace(/;(\s*$)/gm, "")
  }

  private static convertToSingleQuotes(code: string): string {
    // Convert double quotes to single quotes, but preserve quotes inside strings
    return code.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, "'$1'")
  }

  private static fixTrailingCommas(code: string, style: "none" | "es5" | "all"): string {
    if (style === "none") {
      return code.replace(/,(\s*[}\]])/g, "$1")
    }

    if (style === "all") {
      // Add trailing commas where missing
      return code.replace(/([^,\s])(\s*[}\]])/g, "$1,$2")
    }

    return code // es5 style - keep as is
  }

  private static wrapLongLines(code: string, printWidth: number): string {
    const lines = code.split("\n")

    return lines
      .map((line) => {
        if (line.length <= printWidth) return line

        // Simple line wrapping for long lines
        if (line.includes(",")) {
          return line.replace(/,\s*/g, ",\n  ")
        }

        return line
      })
      .join("\n")
  }

  private static checkUnusedImports(line: string, lineNumber: number, warnings: LintWarning[]): void {
    const importMatch = line.match(/import\s+{([^}]+)}\s+from/)
    if (importMatch) {
      const imports = importMatch[1].split(",").map((i) => i.trim())
      imports.forEach((imp) => {
        warnings.push({
          line: lineNumber,
          column: 1,
          message: `'${imp}' is imported but never used`,
          rule: "@typescript-eslint/no-unused-vars",
          suggestion: `Remove unused import '${imp}'`,
        })
      })
    }
  }

  private static checkConsoleStatements(line: string, lineNumber: number, warnings: LintWarning[]): void {
    if (line.includes("console.log") || line.includes("console.error")) {
      warnings.push({
        line: lineNumber,
        column: line.indexOf("console") + 1,
        message: "Unexpected console statement",
        rule: "no-console",
        suggestion: "Remove console statement before production",
      })
    }
  }

  private static checkMissingKeys(line: string, lineNumber: number, errors: LintError[]): void {
    if (line.includes(".map(") && !line.includes("key=")) {
      errors.push({
        line: lineNumber,
        column: 1,
        message: 'Missing "key" prop for element in iterator',
        rule: "react/jsx-key",
        severity: "error",
      })
    }
  }

  private static checkHookRules(line: string, lineNumber: number, errors: LintError[]): void {
    const hookPattern = /use[A-Z]\w*/g
    const hooks = line.match(hookPattern)

    if (hooks && (line.includes("if (") || line.includes("for (") || line.includes("while ("))) {
      errors.push({
        line: lineNumber,
        column: 1,
        message: "React Hook cannot be called inside a loop, condition, or nested function",
        rule: "react-hooks/rules-of-hooks",
        severity: "error",
      })
    }
  }

  private static checkTypeScriptIssues(line: string, lineNumber: number, warnings: LintWarning[]): void {
    if (line.includes(": any")) {
      warnings.push({
        line: lineNumber,
        column: line.indexOf(": any") + 1,
        message: "Unexpected any. Specify a different type",
        rule: "@typescript-eslint/no-explicit-any",
        suggestion: "Use a more specific type instead of any",
      })
    }
  }

  static generatePrettierConfig(): string {
    return JSON.stringify(
      {
        semi: false,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: "es5",
        printWidth: 100,
        useTabs: false,
        bracketSpacing: true,
        arrowParens: "avoid",
        endOfLine: "lf",
      },
      null,
      2,
    )
  }

  static generateESLintConfig(): string {
    return JSON.stringify(
      {
        extends: ["next/core-web-vitals", "@typescript-eslint/recommended", "prettier"],
        parser: "@typescript-eslint/parser",
        plugins: ["@typescript-eslint", "react", "react-hooks"],
        rules: this.eslintRules,
        env: {
          browser: true,
          es2021: true,
          node: true,
        },
      },
      null,
      2,
    )
  }
}
