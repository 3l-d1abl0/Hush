# Choose the Image which has Node installed already
FROM node:14-alpine

# COPY all the files from Current Directory into the Container
COPY ./ ./auth-service

# Set Working Directory
WORKDIR /auth-service

# Install the Project Dependencies like Express Framework
RUN npm install

# Tell that this image is going to Open a Port 
EXPOSE 9090

# Default Command to launch the Application
CMD ["npm", "start"]