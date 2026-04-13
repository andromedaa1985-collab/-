FROM node:20-alpine

WORKDIR /app

# 复制 package.json (如果有 package-lock.json 也会一并复制)
COPY package.json package-lock.json* ./

# 安装依赖
RUN npm install

# 复制所有源代码
COPY . .

# 构建前端静态文件
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动后端服务
CMD ["npm", "run", "start"]
