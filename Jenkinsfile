node('slave1') {
    def changedFiles = sh(
        script: "git diff --name-only HEAD~1 HEAD",
        returnStdout: true
    ).trim()
    echo "Changed files:\n${changedFiles}"
    def BACKEND_CHANGED = changedFiles.contains("backend/")
    def FRONTEND_CHANGED = changedFiles.contains("frontend/")
    def KUBERNETES_BACKEND_CHANGED = changedFiles.contains("kubernetes/backend/")
    def KUBERNETES_FRONTEND_CHANGED = changedFiles.contains("kubernetes/frontend/")
    def stages = ['git-clone','build', 'push']
    for (i in stages) {
        stage(i) {
            if (i == 'git-clone') {
                git branch: 'main',
                    url: 'https://github.com/TAPASHRANJANNANDI/todo-app-mern-node-js.git'
            }
            if (i == 'build') {
                if (BACKEND_CHANGED) {
                    echo "Backend changed – building backend Docker image"
                    sh """
                    cd backend
                    docker build -t todo-node-backend:latest .
                    """
                } else {
                    echo "Backend NOT changed – skipping backend build"
                }
                if (FRONTEND_CHANGED) {
                    echo "Frontend changed – building frontend Docker image"
                    sh """
                    cd frontend
                    docker build -t todo-node-frontend:latest .
                    """
                } else {
                    echo "Frontend NOT changed – skipping frontend build"
                }
            }
            if (i == 'push') {

                if (BACKEND_CHANGED) {
                    sh """
                    docker tag todo-node-backend:latest tapashranjannandi/todo-node-backend:latest
                    docker push tapashranjannandi/todo-node-backend:latest
                    """
                }

                if (FRONTEND_CHANGED) {
                    sh """
                    docker tag todo-node-frontend:latest tapashranjannandi/todo-node-frontend:latest
                    docker push tapashranjannandi/todo-node-frontend:latest
                    """
                }
            }
        }
    }
}
node ('stage2') {
    if (BACKEND_CHANGED) {
        echo "Deploying backend Kubernetes resources"
        sh """
        kubectl rollout restart deployment/nodejs-backend-deployment
        kubectl apply -f kubernetes/backend/deployment.yaml
        kubectl apply -f kubernetes/backend/services.yaml
        """
    } else {
        echo "Skipping backend deploy"
    }
    if (FRONTEND_CHANGED) {
        echo "Deploying frontend Kubernetes resources"
        sh """
        kubectl rollout restart deployment/react-frontend-app-deployment
        kubectl apply -f kubernetes/frontend/deployment.yaml
        kubectl apply -f kubernetes/frontend/services.yaml
        """
    } else {
        echo "Skipping frontend deploy"
    }
    if (KUBERNETES_BACKEND_CHANGED) {
        echo "Kubernetes backend config changed – applying changes"
        sh """
        kubectl apply -f kubernetes/backend/deployment.yaml
        kubectl apply -f kubernetes/backend/services.yaml
        """
    } else {
        echo "Kubernetes backend config NOT changed – skipping"
    }
    if (KUBERNETES_FRONTEND_CHANGED) {
        echo "Kubernetes frontend config changed – applying changes"
        sh """
        kubectl apply -f kubernetes/frontend/deployment.yaml
        kubectl apply -f kubernetes/frontend/services.yaml
        """
    } else {
        echo "Kubernetes frontend config NOT changed – skipping"
    }
}
