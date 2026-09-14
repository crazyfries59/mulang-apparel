# 部署到自己的服务器

这份文档针对 `/tools/techpack-translate`(技术包中文翻译工具)这个功能。整个网站是普通 Next.js 项目,可以照常部署;这里只额外记录这个功能需要注意的地方(依赖原生模块 `canvas`)。中文字体已经打包进仓库了(`assets/fonts/`,开源许可),不需要额外准备。

最快的方式是在服务器上跑 `./deploy.sh`(见本文档步骤 1、2、5、6,`deploy.sh` 把步骤 3、4 都自动做了)。

## 1. 环境要求

- Node.js 18 或以上:`node -v`
- Linux 服务器如果 `npm install` 时 `canvas` 没有可用的预编译二进制,会现场编译,需要先装好编译依赖:
  ```bash
  sudo apt-get update
  sudo apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
  ```
- Windows Server 一般不需要额外装依赖(`canvas` 有 Windows 预编译包)。

## 2. 上传代码 + 安装依赖

把项目文件(不含 `node_modules`、`.next`)上传到服务器,然后:

```bash
cd mulang-apparel
npm install
```

## 3. 中文字体(已内置,通常不用管)

`assets/fonts/NotoSansSC-Variable.ttf` 已经在仓库里(Google Noto Sans SC,SIL Open Font License,免费可商用,许可证文件见同目录 `OFL.txt`),代码默认会用这个字体,服务器上不需要再另外装。只有想换成别的字体时才需要设置 `TECHPACK_FONT` 环境变量指向你自己的字体文件。

## 4. 构建 + 常驻运行

```bash
npm run build
npm install -g pm2
pm2 start npm --name mulang-apparel -- start
pm2 save
pm2 startup   # 按提示配置开机自启
```

默认监听 `3000` 端口(`npm start` 内部由 Next.js 决定,可用 `PORT=xxxx npm start` 改端口)。

## 5. 反向代理 / HTTPS(可选但推荐)

用 nginx 把 80/443 转发到 `127.0.0.1:3000`,再用 certbot 签 HTTPS 证书。示例 nginx 配置:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 6. 上传文件大小限制

技术包 PDF 常见有几 MB(测试用的这份约 5MB)。如果反向代理是 nginx,默认 `client_max_body_size` 是 1MB,记得调大,比如:

```nginx
client_max_body_size 20m;
```

## 7. 更新术语库

`.claude/skills/techpack-translate/glossary.json` 是网页翻译功能实际读取的词库,和 Claude Code 那边用的是同一份文件。以后用 Claude 翻译新文件、往词库里加词后,重新上传这个文件(或整个仓库)到服务器,**不需要重新构建**,下次网页请求会实时读取最新内容。

## 8. 已知限制

- 网页版只会自动套用 `glossary.json` 里已经确认过的词,新文档里没见过的表达会保留英文原文,不会被翻译——需要先用 Claude Code 那边的 techpack-translate 技能把新术语"喂"进词库。
- 页面没有加访问密码/登录限制(按您的要求),任何知道这个网址的人都能上传文件使用。
