import type { PlopTypes } from '@turbo/gen'
import fs from 'node:fs'
import path from 'node:path'

/**
 * 定义生成器答案的类型接口
 */
interface TurboAnswers {
  name: string
  port: number
}

/**
 * 扩展 Plop API 以包含 Turbo 特有的属性
 */
interface TurboPlop extends PlopTypes.NodePlopAPI {
  turbo: {
    paths: {
      root: string
    }
  }
}

export default function generator(plop: TurboPlop): void {
  // 定义自定义复制动作,完全绕过 Handlebars 对源码的解析
  plop.setActionType('copy-template', (answers) => {
    const typedAnswers = answers as TurboAnswers
    const rootPath = plop.turbo?.paths?.root || process.cwd()
    const sourceDir = path.join(rootPath, 'apps/nextjs-template')
    const appsDir = path.join(rootPath, 'apps')
    const destDir = path.join(appsDir, plop.renderString('{{dashCase name}}', answers))

    // 计算端口号: 3000 + 当前 apps 目录下的目录数量
    // 如果只有 nextjs-template,则第一个新建应用为 3001
    const existingApps = fs.readdirSync(appsDir).filter((file) => {
      const fullPath = path.join(appsDir, file)
      return fs.statSync(fullPath).isDirectory()
    })
    const port = 3000 + existingApps.length
    typedAnswers.port = port

    if (fs.existsSync(destDir)) {
      // 如果存在则清理(可选)
      fs.rmSync(destDir, { recursive: true, force: true })
    }

    fs.mkdirSync(destDir, { recursive: true })

    // 复制文件,排除不需要的目录
    fs.cpSync(sourceDir, destDir, {
      recursive: true,
      filter: (src: string) => {
        const relativePath = path.relative(sourceDir, src)
        return !/(node_modules|\.next|\.turbo|dist|build)/.test(relativePath)
      },
    })

    return `成功从模板复制到 apps/${plop.renderString('{{dashCase name}}', answers)} (端口: ${port})`
  })

  // 创建 Next.js 应用生成器
  plop.setGenerator('nextjs-app', {
    description: '从 nextjs-template 创建新的 Next.js 应用',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: '应用名称 (例如: my-app):',
        validate: (input: string) => {
          if (!input) return '应用名称不能为空'
          if (!/^[a-z0-9-]+$/.test(input)) {
            return '应用名称只能包含小写字母、数字和连字符'
          }
          return true
        },
      },
    ],
    actions: [
      // 使用自定义动作复制模板
      {
        type: 'copy-template',
      },
      // 更新 package.json 中的应用名称
      {
        type: 'modify',
        path: '{{ turbo.paths.root }}/apps/{{ dashCase name }}/package.json',
        pattern: /"name": "nextjs-template"/g,
        template: '"name": "{{ dashCase name }}"',
      },
      // 更新 dev 脚本中的端口号
      {
        type: 'modify',
        path: '{{ turbo.paths.root }}/apps/{{ dashCase name }}/package.json',
        pattern: /"dev": "next dev --turbopack"/g,
        template: '"dev": "next dev --turbopack -p {{port}}"',
      },
      // 在根目录 package.json 中添加 dev 脚本
      {
        type: 'modify',
        path: '{{ turbo.paths.root }}/package.json',
        pattern: /"dev:nextjs-template": "turbo dev --filter=nextjs-template",/g,
        template: '"dev:nextjs-template": "turbo dev --filter=nextjs-template",\n    "dev:{{ dashCase name }}": "turbo dev --filter={{ dashCase name }}",',
      },
      // 显示成功消息
      (answers) => {
        const { name, port } = answers as TurboAnswers
        console.log(`\n✅ 成功创建应用: apps/${name}`)
        console.log(`🚀 自动分配端口: ${port}`)
        console.log('\n后续步骤:')
        console.log(`1. cd apps/${name}`)
        console.log('2. 根据需要修改应用配置')
        console.log('3. pnpm install (如果需要)')
        console.log(`4. pnpm dev (启动开发服务器在端口 ${port})\n`)
        return '应用创建完成!'
      },
    ],
  })
}
