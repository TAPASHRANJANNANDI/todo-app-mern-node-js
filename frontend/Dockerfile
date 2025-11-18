#FROM node:18-alpine

#WORKDIR /app

#COPY package*.json ./
#RUN npm install

#COPY . .

#COPY serve.json .
#RUN npm run build

# Serve production build using a lightweight server
#RUN npm install -g serve

#EXPOSE 5173
#CMD ["serve", "-s", "dist", "-l", "5173"]
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

# copy all frontend files
COPY . .

# Expose Vite dev port
EXPOSE 5173

# Run Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

