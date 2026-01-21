# shadcn/ui monorepo template

This template is for creating a monorepo with shadcn/ui.

## Usage

```bash
pnpm dlx shadcn@latest init
```

## 快速创建新应用

项目内置了基于 `@turbo/gen` 的自动化生成器，可以一键克隆应用模板并自动完成配置。

### 运行生成器

在项目根目录下执行：

```bash
pnpm gen:app
```

按照提示输入新应用的名称（例如：`my-new-app`），生成器将自动完成以下操作：

1. **代码克隆**: 基于 `apps/nextjs-template` 模板克隆完整的源代码。
2. **自动分配端口**: 智能统计现有子应用数量，自动分配一个唯一的端口号（如 `3001`, `3002`...），避免开发环境端口冲突。
3. **包名重命名**: 自动更新 `package.json` 中的 `name` 字段。
4. **脚本优化**: 在新应用的 `dev` 脚本中自动注入 `-p <port>` 参数。
5. **根目录脚本注册**: 自动在根目录 `package.json` 的 `scripts` 中添加 `dev:<name>` 命令，方便全局调用。

### 后续步骤

生成完成后，你可以直接进入目录并启动：

```bash
cd apps/my-new-app
pnpm dev
```

## Adding components

To add components to your app, run the following command at the root of your `nextjs-template` app:

```bash
pnpm dlx shadcn@latest add button -c apps/nextjs-template
```

This will place the ui components in the `packages/ui/src/components` directory.

## Tailwind CSS v4

> [!NOTE]
> 本项目已升级至 Tailwind CSS v4，采用 CSS-first 的配置方式。

所有的 Tailwind 配置（包括主题、关键帧等）都直接在 `packages/ui/src/styles/globals.css` 中通过 CSS 变量和 `@theme` 指令定义。不再使用 javascript 配置文件。

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from '@workspace/ui/components/button'
```

## ESLint 配置

项目使用 **ESLint 9.x** 的 flat config 格式，所有配置都采用新的配置方式。

### 配置架构

项目采用统一的 ESLint 配置架构：

1. **共享配置包** (`packages/eslint-config/`):
   - `next.js` - 统一的 ESLint 配置，适用于 Next.js 应用和 React 库
     - 包含基础规则（ESLint 推荐、Prettier 兼容、TypeScript）
     - 包含 React 和 React Hooks 规则（通过 `eslint-config-next/core-web-vitals`）
     - 包含 Next.js 特定规则
     - 包含 Tailwind CSS 支持
     - 包含 Turbo 和 only-warn 插件

2. **根目录配置** (`eslint.config.js`):
   - 使用 flat config 格式（ES modules）
   - 引用 `@workspace/eslint-config/next-js` 作为统一配置
   - 仅应用于根目录文件，忽略 `apps/**` 和 `packages/**`

3. **子包配置**:
   - 每个子包（`apps/*` 和 `packages/*`）都有自己的 `eslint.config.js`
   - 统一使用 `@workspace/eslint-config/next-js` 配置

### 配置说明

#### 统一配置

**文件**: `packages/eslint-config/next.js`

这是项目的统一 ESLint 配置，适用于所有 Next.js 应用和 React 库。

**包含的配置**:

- **基础规则**: ESLint 推荐规则、Prettier 兼容、TypeScript 规则
- **React 规则**: 通过 `eslint-config-next/core-web-vitals` 包含 React 和 React Hooks 规则
- **Next.js 规则**: Next.js 特定的 ESLint 规则
- **Tailwind CSS**: Tailwind CSS 类名检查和验证
- **工具插件**: Turbo 插件（环境变量检查）、only-warn 插件（将错误转为警告）

**配置示例**:

根目录配置 (`eslint.config.js`):

```javascript
import { nextJsConfig } from '@workspace/eslint-config/next-js'

export default [
  ...nextJsConfig,
  {
    ignores: ['apps/**', 'packages/**', 'node_modules/**', '.next/**', 'dist/**', 'build/**', '.turbo/**'],
  },
]
```

子包配置（如 `packages/ui/eslint.config.js`）:

对于 React 组件库，可能需要禁用 Next.js 特定的规则：

```javascript
import { nextJsConfig } from '@workspace/eslint-config/next-js'

const config = [
  ...nextJsConfig,
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
]

export default config
```

对于 Next.js 应用，直接使用配置即可：

```javascript
import { nextJsConfig } from '@workspace/eslint-config/next-js'

export default nextJsConfig
```

**自定义规则**:

- `react/react-in-jsx-scope: "off"` - 新 JSX 转换不需要 React 导入
- `react/prop-types: "off"` - 使用 TypeScript 进行类型检查

### Tailwind CSS ESLint 支持

项目已集成 `eslint-plugin-better-tailwindcss`，用于检查 Tailwind CSS 类名的正确性和最佳实践。

- **配置位置**: `packages/eslint-config/next.js`
- **功能**:
  - 检查 Tailwind CSS 类名是否存在
  - 验证类名顺序和格式
  - 检测未使用的自定义类名
  - 提供 Tailwind CSS 最佳实践建议

### 变更历史

#### 依赖管理优化与 ESLint 配置修复

- **变更时间**: 2024年12月（最新）
- **变更内容**:
  - **依赖管理优化**:
    - 将共享的 devDependencies 移到根目录 `package.json`：
      - `@types/node`、`@types/react`、`@types/react-dom` - 类型定义
      - `tailwindcss` - 样式工具
      - `next` - 用于 `eslint-config-next` 的依赖解析
    - 从子包中移除重复的共享依赖：
      - `apps/nextjs-template`: 移除了共享的类型定义和工具
      - `packages/ui`: 移除了共享的类型定义和工具
    - 保留包特定的依赖：
      - `apps/nextjs-template`: 保留 `babel-plugin-react-compiler`（Next.js 应用特定）
      - `packages/ui`: 保留 `autoprefixer`、`tailwindcss-animate`（UI 包特定）
  - **ESLint 配置修复**:
    - `packages/ui/eslint.config.js`: 添加规则覆盖，禁用 `@next/next/no-html-link-for-pages`（组件库不需要 pages 目录）
    - `apps/nextjs-template/package.json`: 将 lint 脚本从 `next lint` 改为 `eslint . --max-warnings 0`（更好的 flat config 支持）
  - **Catalog 配置修复**:
    - 修复了 `pnpm-workspace.yaml` 中 `@radix-ui/react-slot` 的递归引用问题
    - 重新组织 catalog 条目，按字母顺序排列，提高可维护性
- **变更原因**:
  - 减少依赖重复，简化依赖管理
  - 通过 pnpm 的依赖解析机制，所有子包可以访问根目录的共享依赖
  - 修复 ESLint 配置问题，确保所有包都能正常进行 lint 检查
  - 提高 catalog 配置的可读性和维护性

#### ESLint 配置统一化与依赖清理

- **变更时间**: 2024年12月
- **变更内容**:
  - **ESLint 配置统一化**:
    - 删除了 `packages/eslint-config/base.js` 和 `packages/eslint-config/react-internal.js`
    - 将 `packages/eslint-config/next.js` 作为统一配置，内联了原 base.js 的所有内容
    - 添加了 `globals.browser` 支持，使配置同时适用于 Next.js 应用和 React 库
    - 所有项目（根目录、Next.js 应用、React 库）统一使用 `@workspace/eslint-config/next-js`
    - 更新了 `package.json` exports，只保留 `next-js` 导出
  - **依赖清理**:
    - 移除了 `@eslint/eslintrc` - 不再需要（使用 flat config 格式）
    - 移除了 `@typescript-eslint/eslint-plugin` 和 `@typescript-eslint/parser` - 改用 `eslint-config-next/typescript`
    - 移除了 `typescript-eslint` - 不再需要
    - 移除了 `lucide-react` - 从未使用的依赖中清理
    - 移除了 `zod` - 从未使用的依赖中清理
  - **版本升级**:
    - `next`: `^16.1.3` → `^16.1.4`
    - `eslint-config-next`: `^16.1.3` → `^16.1.4`
  - **其他变更**:
    - `packages/typescript-config/react-library.json` - 添加了 `module: "ESNext"` 和 `moduleResolution: "Bundler"` 配置
    - `apps/nextjs-template/tsconfig.json` - 移除了 `.next/types/**/*.ts` 的 include 配置
- **变更原因**:
  - 简化配置结构，减少维护成本
  - `eslint-config-next` 已包含所有必要的 React 和 TypeScript 规则，无需单独配置
  - 统一配置使所有项目使用相同的规则集，提高一致性
  - 清理未使用的依赖，减少项目体积和潜在的依赖冲突

#### ESLint 9.x Flat Config 迁移

- **迁移时间**: 2024年（已过时，现使用统一配置）
- **变更内容**:
  - 将根目录的 `.eslintrc.js` 迁移到 `eslint.config.mjs`（flat config 格式）
  - 使用 ES modules 替代 CommonJS（`.mjs` 扩展名明确指定为 ES module）
  - 使用 flat config 数组格式替代旧的配置对象格式
  - 使用 `ignores` 字段替代 `ignorePatterns`
  - 引用 `@workspace/eslint-config/base` 作为基础配置（注：现已统一使用 `next-js` 配置）
- **迁移原因**:
  - ESLint 9.x 默认使用 flat config 格式
  - 更好的性能和配置灵活性
  - 与 Turborepo monorepo 架构更兼容
  - 统一配置管理，根目录配置与子包配置保持一致

#### 历史变更

- 移除了 `@next/eslint-plugin-next`、`eslint-plugin-react` 和 `eslint-plugin-react-hooks` 的单独依赖
- 使用 `eslint-config-next` 统一管理 Next.js、React 和 React Hooks 的 ESLint 规则

### Tailwind CSS ESLint 支持

项目已集成 `eslint-plugin-better-tailwindcss`，用于检查 Tailwind CSS 类名的正确性和最佳实践。

- **配置位置**: `packages/eslint-config/next.js`
- **功能**:
  - 检查 Tailwind CSS 类名是否存在
  - 验证类名顺序和格式
  - 检测未使用的自定义类名
  - 提供 Tailwind CSS 最佳实践建议

## 代码格式化

项目使用 **Prettier** 进行代码格式化，并集成了 `prettier-plugin-tailwindcss` 来自动排序 Tailwind CSS 类名。

### Prettier 配置

**配置文件**: `.prettierrc.json`（项目根目录）

**格式化规则**:

- `printWidth: 200` - 每行最大字符数为 200
- `semi: false` - 不使用分号
- `singleQuote: true` - 使用单引号
- `bracketSpacing: true` - 对象括号内添加空格
- `trailingComma: "all"` - 在所有可能的地方添加尾随逗号
- `plugins: ["prettier-plugin-tailwindcss"]` - 自动排序 Tailwind CSS 类名

### Prettier 插件

- **prettier-plugin-tailwindcss@^0.7.2**: 自动按照 Tailwind CSS 推荐的顺序排序类名

### 使用方式

**格式化所有文件**:

```bash
pnpm format
```

**格式化特定文件**:

```bash
pnpm prettier --write "path/to/file"
```

**检查格式**:

```bash
pnpm prettier --check "**/*.{ts,tsx,md}"
```

### 编辑器集成

项目配置与 VS Code/Cursor 的 Prettier 扩展兼容，支持：

- 保存时自动格式化（`editor.formatOnSave: true`）
- 使用项目级别的 Prettier 配置
- 自动应用 Tailwind CSS 类名排序

## Agent Skills 配置

项目已配置项目级别的 Agent Skills，用于提升 AI 辅助开发的代码质量和最佳实践。

### 已安装的 Skills

项目在 `.cursor/skills/` 和 `.agent/skills/` 目录下安装了以下 skills：

1. **vercel-react-best-practices**
   - **描述**: React 和 Next.js 性能优化指南，来自 Vercel Engineering
   - **用途**: 在编写、审查或重构 React/Next.js 代码时确保最佳性能模式
   - **触发场景**:
     - 编写新的 React 组件或 Next.js 页面
     - 实现数据获取（客户端或服务端）
     - 审查代码性能问题
     - 重构现有 React/Next.js 代码
   - **包含**: 45 条规则，涵盖 8 个类别

2. **web-design-guidelines**
   - **描述**: Web 界面指南，用于审查 UI 代码合规性
   - **用途**: 审查代码是否符合 Web 界面指南
   - **触发场景**:
     - 审查 UI 代码
     - 检查可访问性
     - 审计设计
     - 审查 UX
     - 检查网站是否符合最佳实践

3. **frontend-design**
   - **描述**: 创建具有高设计质量的、生产级的独特前端界面
   - **用途**: 当要求构建 Web 组件、页面或应用程序时使用。生成极具创意、打磨精良的代码，避免通用的 AI 美学
   - **触发场景**:
     - 构建新的 UI 组件或完整页面
     - 设计复杂的交互界面
     - 寻求独特的视觉风格和动效
     - 提升前端代码的审美品味

### 安装位置

- **Cursor**: `.cursor/skills/`
- **Antigravity**: `.agent/skills/`

### 使用说明

这些 skills 会在以下场景自动触发：

- 当 AI 助手处理 React/Next.js 相关代码时，会自动应用性能优化最佳实践
- 当审查 UI 代码或进行设计审计时，会自动检查是否符合 Web 界面指南
- 在代码生成和重构过程中，会自动遵循这些最佳实践

### 管理 Skills

如需添加或更新 skills，可以使用：

```bash
pnpx add-skill vercel-labs/agent-skills
```

选择项目级别（Project）安装，skills 将安装到项目的 `.cursor/skills/` 和 `.agent/skills/` 目录。

## 依赖管理

项目使用 **pnpm** 作为包管理器，并通过 **pnpm catalog** 功能统一管理所有子应用的依赖包版本。

### 包管理器

- **pnpm 版本**: `10.15.0`（最新稳定版）
- 通过 `packageManager` 字段在根 `package.json` 中声明，确保所有开发者使用相同版本
- 建议使用 Corepack 或全局安装确保版本一致

### Catalog 配置

项目在 `pnpm-workspace.yaml` 中使用 `catalog` 功能统一管理**所有依赖**的版本。Catalog 条目按**字母顺序**排列，便于查找和维护。

#### Catalog 条目（按字母顺序）

所有依赖都在 `pnpm-workspace.yaml` 的 `catalog` 部分按字母顺序列出，包括：

- **核心框架**: `next`、`react`、`react-dom`
- **开发工具**: `eslint`、`typescript`、`turbo`、`prettier` 等
- **类型定义**: `@types/node`、`@types/react`、`@types/react-dom`
- **UI 组件库**: `@radix-ui/react-slot`、`next-themes`
- **样式工具**: `tailwindcss`、`@tailwindcss/postcss`、`tailwind-merge`
- **构建工具**: `turbo`、`@turbo/gen`、`prettier`
- **工具库**: `class-variance-authority`、`clsx`、`globals`
- **ESLint 相关**: `@eslint/js`、`eslint-config-next`、`eslint-config-prettier`、`eslint-plugin-*`
- **Git 工具**: `husky`、`lint-staged`、`@commitlint/*`
- **其他**: `babel-plugin-react-compiler`

**注意**: Catalog 条目按字母顺序排列，不再按功能分类，这样可以：

- 快速查找依赖
- 避免重复定义
- 更容易维护和更新

所有依赖都通过 catalog 统一管理，确保版本一致性和易于维护。

### 共享依赖管理

项目采用**分层依赖管理**策略，将共享的开发依赖放在根目录，包特定的依赖保留在各自包中。

#### 根目录共享依赖

以下 devDependencies 在根目录 `package.json` 中声明，所有子包都可以通过 pnpm 的依赖解析机制访问：

- **类型定义**: `@types/node`、`@types/react`、`@types/react-dom`
- **开发工具**: `eslint`、`typescript`、`prettier`、`turbo`
- **样式工具**: `tailwindcss`
- **特殊依赖**: `next`（`eslint-config-next` 需要它来解析 `next/babel`）
- **Git 工具**: `husky`、`lint-staged`、`@commitlint/cli`、`@commitlint/config-conventional`

#### 包特定依赖

以下依赖保留在各自包的 `package.json` 中：

- **apps/nextjs-template**:
  - `babel-plugin-react-compiler` - Next.js 应用特定

- **packages/ui**:
  - `tw-animate-css` - UI 包特定样式工具

#### 依赖解析机制

在 pnpm monorepo 中，依赖解析遵循以下顺序：

```
当前包目录 → 父目录 → ... → 根目录
```

当子包需要某个依赖时：

1. 先检查自己的 `node_modules`
2. 向上查找父目录的 `node_modules`
3. 最终找到根目录的 `node_modules`

因此，在根目录安装的共享依赖可以被所有子包访问，无需在每个子包中重复声明。

#### 最佳实践

- ✅ **放在根目录**: 跨包共享的开发工具（eslint、prettier、typescript、turbo 等）
- ✅ **放在根目录**: 类型定义（如果多个包都使用）
- ✅ **放在各自包中**: 包特定的构建工具和配置
- ✅ **放在各自包中**: 运行时依赖（必须在各自的包中声明）

### 使用 Catalog

在子包的 `package.json` 中，使用 `catalog:` 协议引用统一管理的依赖版本：

```json
{
  "dependencies": {
    "react": "catalog:",
    "react-dom": "catalog:",
    "next": "catalog:"
  },
  "devDependencies": {
    "typescript": "catalog:",
    "eslint": "catalog:"
  }
}
```

### 版本更新

- **React**: 已更新到 `v19.2.3`(最新版本)
- **Next.js**: 已更新到 `v16.1.4`(最新版本,支持 React Compiler)
- **Tailwind CSS**: 已升级到 `v4.x` (4.1.18)，采用 CSS-first 配置方式
- **Turbo**: 已从 `v2.6.3` 升级到 `v2.7.4`(使用 `@turbo/codemod` 自动升级,无需 codemod 迁移)
- **ESLint Config**: `eslint-config-next` 升级到 `v16.1.4`, `eslint-config-prettier` 升级到 `v10.1.8`

### 添加新的依赖

当需要添加新的依赖时：

1.  **确定依赖分类**: 根据依赖的功能，确定应该属于哪个分类（核心框架、开发工具、UI 组件库等）
2.  **添加到 catalog**: 在 `pnpm-workspace.yaml` 的 `catalog` 部分，按照分类添加依赖和版本
3.  **在子包中引用**: 在子包的 `package.json` 中使用 `catalog:` 协议引用
4.  **更新依赖**: 运行 `pnpm install` 更新依赖

**注意**: 所有依赖都应该通过 catalog 管理，即使是只在单个子包中使用的依赖，也建议添加到 catalog 中以保持一致性。

### 优势

- **版本一致性**: 确保所有子包使用相同版本的共享依赖
- **简化管理**: 只需在一个地方更新版本，所有子包自动同步
- **减少冲突**: 避免因版本不一致导致的构建或运行时问题

## 项目架构

项目采用 **Turborepo** monorepo 架构，按照功能层次组织包结构，确保依赖关系清晰、构建流程高效。

### 架构层次

项目采用三层架构设计：

```
Level 0 (基础层 - 配置包):
  ├── @workspace/eslint-config      # ESLint 共享配置
  └── @workspace/typescript-config  # TypeScript 共享配置

Level 1 (共享层 - 共享包):
  └── @workspace/ui                 # UI 组件库

Level 2 (应用层 - 应用):
  └── nextjs-template               # Next.js 应用模板(使用 src 目录结构)
```

### 包类型说明

#### 1. 配置包 (Config Packages)

**位置**: `packages/eslint-config/`, `packages/typescript-config/`

**特点**:

- 只包含配置文件，不包含业务逻辑
- 不需要构建过程（没有 `build` 脚本）
- 通过 `exports` 字段导出配置供其他包使用
- 作为 `devDependencies` 被其他包引用

**示例**:

- `@workspace/eslint-config`: 提供统一的 ESLint 配置（next-js）
- `@workspace/typescript-config`: 提供 TypeScript 配置（base、nextjs、react-library、typescript-library）

**最佳实践**:

- ✅ 配置包不应该有 `build` 脚本
- ✅ 配置包应该只作为 `devDependencies`
- ✅ Turborepo 会自动跳过没有 build 任务的包

#### TypeScript 配置说明

`@workspace/typescript-config` 提供了四种 TypeScript 配置，适用于不同的项目类型：

1. **base.json** - 基础配置
   - 包含通用的 TypeScript 设置（严格模式、类型检查等）
   - 使用 `NodeNext` 模块系统
   - 所有其他配置都继承此基础配置

2. **nextjs.json** - Next.js 应用配置
   - 继承 `base.json`
   - 使用 `ESNext` 模块系统和 `Bundler` 模块解析
   - 配置 `jsx: "preserve"`（Next.js 自己处理 JSX）
   - 启用 `allowJs` 和 `noEmit`
   - 包含 Next.js 插件

3. **react-library.json** - React 组件库配置
   - 继承 `base.json`
   - 使用 `ESNext` 模块系统和 `Bundler` 模块解析
   - 配置 `jsx: "react-jsx"`（编译时转换 JSX）
   - 适用于包含 React 组件的共享库（如 `@workspace/ui`）

4. **typescript-library.json** - 纯 TypeScript 库配置
   - 继承 `base.json`
   - 使用 `ESNext` 模块系统和 `Bundler` 模块解析
   - 不包含 JSX 相关配置
   - 适用于纯 TypeScript 共享包（如 hooks 共享包、工具函数库等）

**使用示例**:

Next.js 应用 (`apps/nextjs-template/tsconfig.json`):

```json
{
  "extends": "@workspace/typescript-config/nextjs.json"
}
```

React 组件库 (`packages/ui/tsconfig.json`):

```json
{
  "extends": "@workspace/typescript-config/react-library.json"
}
```

纯 TypeScript 库 (`packages/hooks/tsconfig.json`):

```json
{
  "extends": "@workspace/typescript-config/typescript-library.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

#### 2. 共享包 (Shared Packages)

**位置**: `packages/ui/`

**特点**:

- 包含可复用的业务逻辑或组件
- 可能包含构建过程（如果有编译需求）
- 可以被多个应用引用
- 依赖配置包（开发时依赖）

**示例**:

- `@workspace/ui`: 共享 UI 组件库，包含 React 组件、样式和工具函数

**依赖关系**:

- 依赖 `@workspace/eslint-config`（开发时配置）
- 依赖 `@workspace/typescript-config`（开发时配置）

#### 3. 应用 (Applications)

**位置**: `apps/nextjs-template/`

**特点**:

- 独立的可部署应用
- 包含完整的构建和运行脚本
- 依赖共享包和配置包
- 是最终的产品输出
- **使用标准 src 目录结构**,符合 Next.js 最佳实践

**目录结构**:

```
apps/nextjs-template/
├── src/                    # 源代码目录
│   ├── app/               # Next.js App Router
│   ├── components/        # React 组件
│   ├── hooks/             # 自定义 Hooks
│   └── lib/               # 工具函数
├── next.config.ts         # Next.js 配置(启用 React Compiler)

└── tsconfig.json          # TypeScript 配置
```

**示例**:

- `nextjs-template`: Next.js 应用模板,使用 UI 组件库和共享配置,启用 React Compiler

**依赖关系**:

- 运行时依赖 `@workspace/ui`
- 开发时依赖 `@workspace/eslint-config`
- 开发时依赖 `@workspace/typescript-config`
- 开发时依赖 `babel-plugin-react-compiler`(React Compiler 支持)

### 依赖关系图

```
@workspace/eslint-config (配置包,无 build)
@workspace/typescript-config (配置包,无 build)
    ↓
@workspace/ui (共享包,有 lint/check-types)
    ↓
nextjs-template (应用,有 build/dev/lint/check-types,启用 React Compiler)
```

**说明**:

- Turborepo 会自动跳过没有 build 任务的包
- 使用 `dependsOn: ["^build"]` 时，只会等待有 build 任务的依赖包

### Turborepo 任务配置

在 `turbo.json` 中配置的任务会自动处理包类型差异：

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"], // 只等待有 build 任务的依赖包
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"] // 配置包可以没有 lint 任务
    },
    "check-types": {
      "dependsOn": ["^check-types"] // 类型检查依赖关系
    },
    "clean": {
      "cache": false,
      "dependsOn": [] // 清理任务不需要依赖
    },
    "deep-clean": {
      "cache": false,
      "dependsOn": [] // 深度清理任务不需要依赖
    }
  }
}
```

**关键点**:

- `dependsOn: ["^build"]` 中的 `^` 表示只等待依赖包的 build
- 如果依赖包没有对应的任务，Turborepo 会自动跳过
- 配置包不需要 build 任务，不会影响构建流程

### 架构优势

1. **清晰的依赖层次**: 配置包 → 共享包 → 应用，依赖关系一目了然
2. **高效的构建流程**: 配置包无需构建，减少不必要的构建步骤
3. **易于维护**: 配置集中管理，修改一处即可影响所有包
4. **类型安全**: TypeScript 配置统一，确保类型一致性
5. **代码复用**: 共享包可以被多个应用复用，减少重复代码

### 添加新包的指南

#### 添加新的配置包

1. 在 `packages/` 下创建新目录
2. 创建 `package.json`，设置 `exports` 字段
3. **不要**添加 `build` 脚本
4. 在 `pnpm-workspace.yaml` 中确保包被包含

#### 添加新的共享包

1. 在 `packages/` 下创建新目录
2. 创建 `package.json`，添加必要的脚本（lint、check-types 等）
3. 如果需要构建，添加 `build` 脚本
4. 在 `turbo.json` 中配置相应的任务

#### 添加新的应用

1. 在 `apps/` 下创建新目录
2. 创建完整的应用结构
3. 添加所有必要的脚本（dev、build、lint、check-types 等）
4. 在 `turbo.json` 中确保任务配置正确

### 可视化依赖关系

使用 Turborepo Devtools 可视化依赖关系和任务执行：

```bash
# 启动 Devtools
pnpm devtools

# 在浏览器中打开显示的地址，可以：
# - 查看包之间的依赖关系图
# - 实时监控任务执行状态
# - 分析构建性能和缓存命中率
# - 查看任务执行历史
```

Devtools 提供了比静态依赖图更强大的功能，包括实时监控、交互式探索和性能分析。

## 脚本命令

项目在根目录 `package.json` 中提供了多个常用的开发脚本命令，方便日常开发工作, 其中和turbo任务集成的命令，实际上是触发了turbo命令，再通过turborepo去触发各个子应用和共享包对应的脚本命令。

### 可用脚本

| 命令                | 用途           | Turborepo 集成 | 说明                                                  |
| ------------------- | -------------- | -------------- | ----------------------------------------------------- |
| `pnpm dev`          | 启动开发服务器 | ✅             | 使用 Turborepo 并行启动所有子包的开发服务器           |
| `pnpm build`        | 构建项目       | ✅             | 使用 Turborepo 并行构建所有子包                       |
| `pnpm lint`         | 代码检查       | ✅             | 使用 Turborepo 并行执行所有子包的 ESLint 检查         |
| `pnpm check-types`  | 类型检查       | ✅             | 使用 Turborepo 并行执行所有子包的 TypeScript 类型检查 |
| `pnpm format`       | 格式化代码     | ❌             | 使用 Prettier 格式化所有文件（会修改文件）            |
| `pnpm format:check` | 检查代码格式   | ❌             | 使用 Prettier 检查代码格式（不修改文件）              |
| `pnpm clean`        | 清理构建产物   | ✅             | 使用 Turborepo 并行清理所有子包的构建产物和缓存文件   |
| `pnpm deep-clean`   | 深度清理       | ✅             | 清理 Turborepo 缓存并执行所有子包的清理任务           |
| `pnpm devtools`     | 开发工具       | ✅             | 启动 Turborepo Devtools 可视化工具                    |
| `pnpm gen:app`      | 创建新应用     | ✅             | 使用自定义生成器从 `nextjs-template` 创建新的子应用   |

### 详细说明

#### 开发与构建

```bash
# 启动开发服务器（所有子包）
pnpm dev

# 构建所有子包
pnpm build
```

#### 代码质量检查

```bash
# 检查代码 lint 规则
pnpm lint

# 检查 TypeScript 类型
pnpm check-types

# 检查代码格式（不修改文件）
pnpm format:check

# 自动修复代码格式
pnpm format
```

#### 清理与可视化

```bash
# 清理所有构建产物和缓存
pnpm clean

# 深度清理（包括 Turborepo 缓存）
pnpm deep-clean

# 启动 Turborepo Devtools 可视化工具
pnpm devtools
```

### clean 脚本说明

`clean` 脚本通过 Turborepo 执行，会并行清理所有子包的构建产物和缓存文件。

**清理内容**（由各子包的 `clean` 脚本定义）:

- `.turbo/` - Turborepo 缓存目录（仅子包级别）
- `dist/` - 构建输出目录
- `build/` - 构建输出目录
- `.next/` - Next.js 构建输出目录
- `node_modules/.cache/` - 各种工具的缓存目录
- `.eslintcache` - ESLint 缓存文件
- `.prettiercache` - Prettier 缓存文件

**注意**: `clean` 脚本不会删除 `node_modules/` 目录，如需完全清理，请手动删除。各子包需要在 `package.json` 中定义自己的 `clean` 脚本来指定要清理的内容。

### deep-clean 脚本说明

`deep-clean` 脚本执行更彻底的清理，包括：

1. **清理 Turborepo 根缓存**: 使用 `turbo clean` 清理根目录的 `.turbo/` 缓存
2. **清理所有子包**: 然后执行 `turbo run clean` 清理所有子包的构建产物

**与 `clean` 的区别**:

- `clean`: 只清理子包的构建产物，保留 Turborepo 根缓存
- `deep-clean`: 清理 Turborepo 根缓存 + 所有子包的构建产物

**使用场景**:

- 当遇到缓存问题时，使用 `deep-clean` 可以完全重置构建环境
- 在 CI/CD 环境中，可以使用 `deep-clean` 确保干净的构建
- 当依赖关系发生变化时，使用 `deep-clean` 可以避免缓存导致的构建错误

**注意**: `deep-clean` 会删除所有缓存，下次构建会重新计算所有任务，构建时间会变长。

### devtools 脚本说明

`devtools` 脚本启动 Turborepo Devtools，这是一个强大的可视化工具，可以：

- **实时监控**: 实时查看任务执行状态和性能指标
- **依赖关系可视化**: 交互式查看包之间的依赖关系
- **任务分析**: 分析任务执行时间、缓存命中率等
- **性能优化**: 识别构建瓶颈和优化机会
- **缓存管理**: 查看和管理 Turborepo 缓存

**使用方法**:

```bash
# 启动 Devtools
pnpm devtools

# 启动后，会在终端显示访问地址：
# WebSocket: ws://localhost:9876
# Browser:   https://turborepo.dev/devtools?port=9876
```

**功能特性**:

- **任务监控**: 实时查看所有任务的执行状态
- **依赖图**: 交互式依赖关系图，支持缩放和搜索
- **性能分析**: 查看任务执行时间、缓存命中率等指标
- **历史记录**: 查看历史任务执行记录
- **过滤功能**: 按包、任务类型等过滤视图

**注意**: Devtools 需要在开发环境中运行，按 `Ctrl+C` 可以停止服务。

### Turborepo 集成

以下脚本通过 Turborepo 执行，享受缓存和并行执行的优势：

- `dev` - 开发服务器
- `build` - 构建任务
- `lint` - 代码检查
- `check-types` - 类型检查
- `clean` - 清理构建产物
- `deep-clean` - 深度清理（包括 Turborepo 缓存）
- `devtools` - 开发工具（可视化监控和分析）

这些任务在 `turbo.json` 中配置了依赖关系和缓存策略，确保高效的开发体验。

## 代码质量与提交规范

项目集成了 **Husky**、**lint-staged** 和 **commitlint**，用于在提交前自动检查代码质量和规范提交信息格式。

### Husky

**Husky** 用于管理 Git hooks，确保在提交代码前自动执行代码质量检查。

#### 配置说明

- **安装位置**: 项目根目录 `.husky/` 目录
- **初始化**: 通过 `package.json` 中的 `prepare` 脚本自动初始化
- **Hooks**:
  - `pre-commit`: 在提交前运行 `lint-staged`，对暂存文件进行格式化和检查
  - `commit-msg`: 在提交时验证 commit message 格式是否符合规范

#### Hook 文件格式

Husky hooks 文件使用简化的格式，移除了旧版本的 `#!/usr/bin/env sh` 和 `. "$(dirname -- "$0")/_/husky.sh"` 行，以兼容 Husky v10.0.0。

**示例** (`.husky/pre-commit`):

```bash
pnpm exec lint-staged
```

**示例** (`.husky/commit-msg`):

```bash
pnpm exec commitlint --edit $1
```

**注意**: 这种格式在 Husky v9 和 v10 中都可以正常工作，避免了升级时的兼容性问题。

#### npx vs pnpm exec 的区别

**为什么官方文档使用 `npx`？**

官方文档（如 [lint-staged](https://github.com/lint-staged/lint-staged) 和 [commitlint](https://commitlint.js.org/)）使用 `npx` 的原因：

1. **通用性**: `npx` 随 npm 一起提供，几乎所有 Node.js 环境都有，无需额外安装
2. **跨包管理器兼容**: 无论使用 npm、yarn 还是 pnpm，`npx` 都能工作
3. **智能查找**: `npx` 会优先使用本地已安装的包，如果不存在才临时下载
4. **文档可复制性**: 示例代码可以直接复制使用，无需考虑包管理器

**npx 的工作方式**:

- 首先查找 `node_modules/.bin` 中的本地安装包
- 如果找不到，临时下载并执行
- 支持 `--no` 选项防止自动安装（`npx --no -- commitlint`）

**pnpm exec 的优势**（适合我们的场景）:

1. **更快**: 直接运行本地已安装的包，无需查找或下载
2. **更可靠**: 使用项目依赖的精确版本，避免版本不一致
3. **离线工作**: 不依赖网络，完全使用本地安装的包
4. **Monorepo 友好**: 在 pnpm workspace 中正确解析依赖
5. **明确性**: 明确表示使用本地安装的包，而不是临时下载

**pnpm exec vs pnpm dlx**:

- `pnpm exec`: 运行本地已安装的包（类似 `npm exec`）
- `pnpm dlx`: 临时下载并运行包（类似 `npx`，但不支持 `--no` 选项）

**我们的选择**:

由于项目：

- 使用 pnpm 作为包管理器（`packageManager: "pnpm@10.28.0"`）
- `lint-staged` 和 `commitlint` 已在 `devDependencies` 中安装
- 是 Turborepo monorepo，需要确保使用正确的依赖版本

因此选择 `pnpm exec` 是最佳实践，它：

- 更快（无需查找或下载）
- 更可靠（使用项目依赖的版本）
- 更符合 pnpm monorepo 的最佳实践

**总结**:

- **通用场景/文档示例**: 使用 `npx`（兼容性最好）
- **pnpm 项目 + 本地已安装**: 使用 `pnpm exec`（更快更可靠，当前使用）
- **临时运行未安装的包**: 使用 `pnpm dlx`（类似 npx，但不支持 `--no`）

#### 工作原理

1. 当执行 `git commit` 时，Husky 会自动触发 `pre-commit` hook
2. `pre-commit` hook 执行 `lint-staged`，对暂存的文件进行格式化（Prettier）和检查（ESLint）
3. 如果检查通过，继续执行 `commit-msg` hook 验证提交信息格式
4. 如果任何检查失败，提交将被阻止

### Lint-Staged

**lint-staged** 用于只对 Git 暂存区（staged）的文件运行 linters，提高提交效率。

#### 配置文件

**文件位置**: `package.json` 中的 `lint-staged` 字段（项目根目录）

**配置规则**:

```json
{
  "lint-staged": {
    "**/*.{js,jsx,ts,tsx}": ["npx eslint --fix", "npx prettier --write"],
    "**/*.{css,scss,md,json}": ["npx prettier --write"]
  }
}
```

**注意**: 使用 `npx` 来执行命令，确保能找到正确的可执行文件（eslint 和 prettier）。

#### 处理流程

- **TypeScript/JavaScript 文件** (`*.ts`, `*.tsx`, `*.js`, `*.jsx`):
  - 运行 `eslint --fix` 自动修复可修复的问题
  - 运行 `prettier --write` 格式化代码
- **样式和文档文件** (`*.css`, `*.scss`, `*.md`, `*.json`):
  - 运行 `prettier --write` 格式化代码

#### 优势

- **只处理变更文件**: 只对暂存的文件进行检查，提高效率
- **自动修复**: ESLint 和 Prettier 会自动修复可修复的问题
- **Monorepo 支持**: 自动匹配所有子包的文件，无需额外配置
- **配置简化**: 配置直接集成在 `package.json` 中，无需单独的配置文件

#### 配置说明

根据 [lint-staged 官方文档](https://github.com/lint-staged/lint-staged?tab=readme-ov-file#configuration)，lint-staged 支持多种配置方式：

- **package.json**: 在 `package.json` 中使用 `lint-staged` 字段（推荐，当前使用）
- **独立配置文件**: `.lintstagedrc.js`、`.lintstagedrc.json` 等（已弃用）

项目选择在 `package.json` 中配置，简化项目结构，减少配置文件数量。

### Commitlint

**commitlint** 用于验证 commit message 是否符合 **Conventional Commits** 规范。

#### 配置文件

**文件位置**: `package.json` 中的 `commitlint` 字段（项目根目录）

**配置规则**:

```json
{
  "commitlint": {
    "extends": ["@commitlint/config-conventional"],
    "rules": {
      "type-enum": [2, "always", ["feat", "fix", "chore", "docs", "style", "refactor", "perf", "test"]],
      "scope-empty": [0],
      "subject-case": [2, "always", "lower-case"],
      "header-max-length": [2, "always", 100]
    }
  }
}
```

**配置说明**:

- **基础配置**: 使用 `@commitlint/config-conventional` 作为基础配置
- **类型枚举**: 支持以下提交类型：
  - `feat`: 新功能
  - `fix`: 修复 bug
  - `chore`: 构建过程或辅助工具的变动
  - `docs`: 文档变更
  - `style`: 代码格式（不影响代码运行的变动）
  - `refactor`: 重构（既不是新增功能，也不是修复 bug）
  - `perf`: 性能优化
  - `test`: 测试相关
- **Scope**: 可选，允许为空
- **Subject**: 必须小写
- **Header 长度**: 最大 100 字符

**注意**: 根据 [commitlint 官方文档](https://commitlint.js.org/reference/configuration.html#config-via-package-json)，commitlint 支持在 `package.json` 中使用 `commitlint` 字段配置，无需单独的配置文件。项目选择在 `package.json` 中配置，简化项目结构。

#### 提交信息格式

提交信息必须遵循以下格式：

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**示例**:

```bash
feat(ui): add button component
fix(web): resolve navigation issue
chore: update dependencies
docs: update README
```

#### 验证流程

1. 当执行 `git commit` 时，Husky 的 `commit-msg` hook 会被触发
2. `commit-msg` hook 执行 `commitlint --edit $1` 验证提交信息
3. 如果提交信息不符合规范，提交将被阻止并显示错误信息
4. 修改提交信息后重新提交即可

### Turborepo 集成

项目中的代码质量工具与 Turborepo 完美集成：

- **统一配置**: 所有配置都在根目录，适用于整个 monorepo
- **缓存支持**: Turborepo 可以缓存 lint 和 format 任务的结果
- **并行执行**: 在 CI/CD 环境中，Turborepo 可以并行执行多个包的检查任务

#### 相关脚本

在根 `package.json` 中：

```json
{
  "scripts": {
    "lint": "turbo lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "prepare": "husky install"
  }
}
```

- `pnpm lint`: 使用 Turborepo 并行执行所有子包的 lint 任务
- `pnpm format`: 格式化所有文件
- `prepare`: 在安装依赖后自动初始化 Husky

### 使用示例

#### 正常提交流程

```bash
# 1. 修改文件
git add .

# 2. 提交（会自动触发 pre-commit 和 commit-msg hooks）
git commit -m "feat(ui): add new component"

# 如果代码有格式问题，lint-staged 会自动修复并重新暂存
# 如果提交信息格式不正确，commitlint 会阻止提交
```

#### 跳过 Hooks（不推荐）

如果确实需要跳过 hooks（例如在 CI 环境中），可以使用：

```bash
git commit --no-verify -m "message"
```

**注意**: 仅在特殊情况下使用，正常情况下应遵循代码质量检查。

### 依赖版本

项目使用以下版本的工具：

- **husky**: `^9.1.7` - Git hooks 管理工具
- **lint-staged**: `^16.2.7` - 暂存文件检查工具
- **@commitlint/cli**: `^20.3.1` - Commitlint 命令行工具
- **@commitlint/config-conventional**: `^20.3.1` - Conventional Commits 规范配置

所有依赖都通过 pnpm catalog 统一管理，确保版本一致性。

### 注意事项

1. **首次使用**: 克隆项目后，运行 `pnpm install` 会自动执行 `prepare` 脚本初始化 Husky
2. **权限问题**: 如果 hooks 无法执行，确保 `.husky/` 目录下的文件具有可执行权限
3. **性能优化**: lint-staged 只处理暂存文件，不会影响整个项目的检查性能
4. **团队协作**: 所有团队成员都应遵循相同的提交规范，确保项目历史记录的一致性

## Tailwind CSS 版本说明

项目经历了从 v4 -> v3 -> v4 的变迁。

- **当前版本**: `v4.x` (4.1.18)
- **配置方式**: CSS-first (globals.css)
- **历史记录**: 曾短暂降级至 `v3.4.17` 以测试兼容性，后恢复至 `v4` 以利用其更现代化的特性和更好的性能。

## React Compiler 支持

项目已在 `nextjs-template` 应用中启用 **React Compiler**,这是 React 19 的新特性,可以自动优化组件性能。

### 什么是 React Compiler?

React Compiler 是 React 团队开发的编译时优化工具,可以:

- **自动记忆化**: 自动优化组件和 hooks,减少不必要的重新渲染
- **性能提升**: 无需手动使用 `useMemo`、`useCallback` 和 `React.memo`
- **代码简化**: 编写更简洁的代码,编译器自动处理优化

### 配置说明

#### 1. 依赖安装

在 `pnpm-workspace.yaml` 中添加:

```yaml
catalog:
  'babel-plugin-react-compiler': ^1.0.0
```

在应用的 `package.json` 中引用:

```json
{
  "devDependencies": {
    "babel-plugin-react-compiler": "catalog:"
  }
}
```

#### 2. Next.js 配置

在 `apps/nextjs-template/next.config.ts` 中启用:

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true, // 启用 React Compiler
}

export default nextConfig
```

### 使用方式

启用 React Compiler 后,**无需修改现有代码**。编译器会自动分析并优化你的组件:

**优化前** (手动优化):

```tsx
const Component = () => {
  const expensiveValue = useMemo(() => computeExpensive(data), [data])
  const handleClick = useCallback(() => doSomething(), [])

  return <Child value={expensiveValue} onClick={handleClick} />
}
```

**优化后** (React Compiler 自动处理):

```tsx
const Component = () => {
  const expensiveValue = computeExpensive(data)
  const handleClick = () => doSomething()

  return <Child value={expensiveValue} onClick={handleClick} />
}
```

编译器会自动识别需要优化的部分并进行记忆化处理。

### 兼容性

- **React 版本**: 需要 React 19+ (项目使用 `^19.2.3`)
- **Next.js 版本**: 需要 Next.js 16+ (项目使用 `^16.1.4`)
- **TypeScript**: 完全支持 TypeScript

### 最佳实践

1. **保持代码简洁**: 不再需要手动添加 `useMemo`、`useCallback`
2. **遵循 React 规则**: 编译器基于 React 的规则进行优化,确保遵循 React 最佳实践
3. **渐进式采用**: 可以在部分组件中使用,与现有代码兼容

### 性能监控

使用 React DevTools Profiler 可以查看编译器的优化效果:

```bash
# 安装 React DevTools
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
```

### 参考资源

- [React Compiler 官方文档](https://react.dev/learn/react-compiler)
- [Next.js React Compiler 配置](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler)
- [React 19 发布说明](https://react.dev/blog/2024/12/05/react-19)

## 项目目录结构

项目采用标准的 Turborepo monorepo 结构,`nextjs-template` 应用使用 **src 目录结构**:

```
my-turborepo/
├── apps/
│   └── nextjs-template/          # Next.js 应用模板
│       ├── src/                  # 源代码目录 (标准结构)
│       │   ├── app/             # Next.js App Router
│       │   ├── components/      # React 组件
│       │   ├── hooks/           # 自定义 Hooks
│       │   └── lib/             # 工具函数
│       ├── next.config.ts       # Next.js 配置 (启用 React Compiler)
│       ├── tailwind.config.ts   # Tailwind CSS 配置
│       ├── tsconfig.json        # TypeScript 配置
│       └── package.json         # 依赖配置
├── packages/
│   ├── ui/                      # 共享 UI 组件库
│   ├── eslint-config/           # ESLint 共享配置
│   └── typescript-config/       # TypeScript 共享配置
├── pnpm-workspace.yaml          # pnpm workspace 配置
├── turbo.json                   # Turborepo 配置
└── package.json                 # 根 package.json

```

### src 目录结构优势

1. **符合 Next.js 最佳实践**: `create-next-app` 默认生成的结构
2. **代码组织清晰**: 源代码与配置文件分离
3. **易于维护**: 所有业务代码集中在 `src` 目录
4. **团队协作友好**: 更符合开发者习惯
