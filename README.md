# 🛡️ PACS Portal: Enterprise PoC
## **Cost-Optimized & Resilient Medical Imaging Stack on GKE Spot VMs**

This project is a high-performance **Proof of Concept (PoC)** for a modern Picture Archiving and Communication System (PACS) portal. It demonstrates a **"Self-Healing"** cloud architecture designed to maintain 100% availability on volatile infrastructure using **GKE Spot VMs**, **PostgreSQL 18**, and **PgCat** for intelligent connection pooling.

> [!CAUTION]
> **📝 Disclaimer:** FOR DEMONSTRATION PURPOSES ONLY. All data within this portal is purely fictitious and generated via the Faker library. This system is not HIPAA-compliant and is intended solely to showcase GKE, CloudSQL, and PgCat integration.

---

## 🏗️ Technical Architecture & Cost Optimization

### **⚡ Performance & Hardware Specs (GCP)**
The infrastructure is engineered for the maximum **Price-to-Performance** ratio on Google Cloud:
* **Node Type:** GKE **Spot VMs** using `e2-medium` instances (2 vCPUs, 4 GB RAM).
* **Storage:** **40 GB Standard HDD** per node, balancing capacity for OS stability and logging.
* **Micro-Containers:** Both Frontend and Backend are built on **Alpine Linux** for ultra-small images (<100MB), enabling rapid scaling.



### **🛡️ High Availability (HA) & Spot Resilience**
* **2-Node Minimum:** Core services (**Frontend**, **Backend API**, and **PgCat**) run at least **2 replicas**.
* **Pod Anti-Affinity:** Scheduling "repels" identical pods to different physical nodes to prevent single-point-of-failure.
* **Traffic Management:** A **Google Cloud External Application Load Balancer** (GKE Ingress) manages Layer 7 routing and health-check-based failover.

---

## 🏗️ DevOps & Engineering Standards

* **☁️ Cloud-Native CI/CD:** Utilizes **Google Cloud Build** to offload resource-intensive Docker compilation.
* **🏷️ Immutable Tagging:** Implements industry-standard **Immutability** by using unique Unix-timestamped image tags (e.g., `latest-1770934118`).
* **🔐 12-Factor App Compliance:** Configuration is decoupled via root-level `.env` management, ensuring the stack is portable across Local, Dev, and Prod environments.

---

## 🚀 Key Features

### **🏥 Clinical & Diagnostic Tools**
* **🖼️ DICOM Viewer:** Integrated browser-based viewer for on-the-fly medical image inspection.
* **🔎 Global Study List:** Advanced directory with MRN/Accession filtering and server-side pagination.
* **📊 Analytics Dashboard:** Real-time visualization of modality distribution (CT, MR, US) using **Chart.js**.

---

## 🚦 Deployment Options

### **🐳 Option A: Portable Local Stack (Docker Compose)**
Ideal for local development without GCP access. 

```bash
# Launch the entire self-running stack (Postgres 18, PgCat, API, & UI)
docker-compose up --build
```
**🌍 Access:**

* **Portal:** http://localhost:4200

* *API:** http://localhost:8000

### **☸️ Option B: Manual GKE Build (Local Resources)**
Standard Kubernetes deployment using your local machine's RAM/CPU for building.
```bash
# 1. Build optimized Alpine Images locally
docker build -t pacs-backend:latest ./backend
docker build -t pacs-frontend:latest ./frontend

# 2. Deploy to Kubernetes
kubectl apply -f k8s/
```

### **☁️ Option C: Automated Cloud Deployment (Recommended)**
Offloads builds to Google Cloud Build for maximum speed and zero local overhead.
```bash
# 1. Authenticate and set project
gcloud auth login
gcloud config set project mwakilishi-1770258957

# 2. Execute Cloud-Optimized deployment scripts
./backend/deploy-backend.sh
./frontend/deploy-frontend.sh
```

### *⏪ How to Rollback*
If a deployment fails, revert to a previous version by identifying the prior TAG in Artifact Registry:

```bash
kubectl set image deployment/pacs-backend \
  pacs-api=REGION-docker.pkg.dev/PROJECT/REPO/IMAGE:PREVIOUS_TAG
```

---
> [!CAUTION]
> **📝 Disclaimer:** FOR DEMONSTRATION PURPOSES ONLY. All data within this portal is purely fictitious and generated via the Faker library. This system is not HIPAA-compliant and is intended solely to showcase GKE, CloudSQL, and PgCat integration, as well as automation.
