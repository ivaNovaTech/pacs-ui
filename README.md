# 🛡️ PACS Portal: Enterprise PoC
### Cost-Optimized & Resilient Medical Imaging Stack on GKE Spot VMs

This project is a high-performance **Proof of Concept (PoC)** for a modern Picture Archiving and Communication System (PACS) portal. It demonstrates a **"Self-Healing"** cloud architecture designed to maintain 100% availability on volatile infrastructure using **GKE Spot VMs**, **PostgreSQL 18**, and **PgCat** for intelligent connection pooling.



---

## 🏗️ Technical Architecture & Cost Optimization

### ⚡ Performance & Hardware Specs (GCP)
The infrastructure is engineered for the maximum "Price-to-Performance" ratio on Google Cloud:
* **Node Type:** GKE **Spot VMs** using `e2-medium` instances (2 vCPUs, 4 GB RAM).
* **Storage:** **40 GB Standard HDD** per node, balancing capacity for OS stability and logging while staying within budget constraints.
* **Micro-Containers:** Both Frontend and Backend are built on **Alpine Linux**. 
    * *Benefit:* Ultra-small images (<100MB) enable rapid scaling and minimal memory overhead on the 4GB nodes.

### 🛡️ High Availability (HA) & Spot Resilience
We implement a "Defense in Depth" strategy against Spot VM reclaims:
* **2-Node Minimum:** Core services (**Frontend**, **Backend API**, and **PgCat**) run at least **2 replicas** across the 3-node cluster.
* **Pod Anti-Affinity:** Strict scheduling "repels" identical pods to different physical nodes to prevent single-point-of-failure during node preemption.
* **Traffic Management:** A **Google Cloud External Application Load Balancer** (GKE Ingress) manages Layer 7 routing and provides automatic health-check-based failover.



### 🗄️ Database Layer (2026 Standards)
* **PostgreSQL 18:** Managed via **Cloud SQL** (or local container), utilizing the latest 2026 relational engine features for optimized medical records.
* **PgCat Proxy:** A high-performance gateway managing connection pooling to ensure the `e2-medium` nodes aren't overwhelmed by database handshakes.

## 🏗️ DevOps & Engineering Standards

* **☁️ Cloud-Native CI/CD:** Utilizes **Google Cloud Build** to offload resource-intensive Docker compilation. This ensures local hardware remains performant and prevents GKE node exhaustion during deployment cycles.
* **🏷️ Immutable Tagging:** Implements industry-standard **Immutability** by using unique Unix-timestamped image tags (e.g., TAG="latest-$(date +%s)"    ==> `latest-#TAG`). This provides a reliable audit trail in the Artifact Registry and enables near-instant rollbacks to known-good states.
* **🔐 12-Factor App Compliance:** Configuration is strictly decoupled from the application logic via root-level environment management. This enhances security by preventing credential leakage in version control and ensures the stack is portable across Local, Dev, Staging, and Production environments.

---

## 🚀 Key Features

### 🏥 Clinical & Diagnostic Tools
* 🖼️ **DICOM Viewer:** Integrated browser-based viewer for on-the-fly medical image inspection.
* 🔎 **Global Study List:** Advanced study directory with filtering (MRN, Accession, Modality) and server-side pagination.
* 📊 **Analytics Dashboard:** Real-time visualization of modality distribution (CT, MR, US, DX) and study volume trends over time using **Chart.js**.

### 💓 Monitoring & Data Integrity
* 🚦 **Live Heartbeats:** Real-time health indicators on the UI monitoring the connectivity status of the **API** and **Database**.
* 🖥️ **Infrastructure Sidebar:** Live monitoring of **CPU, RAM, and HDD** usage across the GKE cluster, allowing for real-time resource tracking.
* 🧪 **Automated Seeding:** Integrated Python `Faker` engine to populate the system with 50,000+ fictitious, realistic medical records for stress testing.

---

## 🚦 Deployment Options

### 🐳 Option A: Portable Local Stack (Docker Compose)
Ideal for local development or testing in environments without GCP access. This creates a fully "Self-Running" environment on any machine supporting Docker.
```bash
# Launch the entire self-running stack (Postgres 18, PgCat, API, & UI)
docker-compose up --build

> **Access:** Portal is available at `http://localhost:4200` | API at `http://localhost:8000`

### ☸️ Option B: Manually run GKE Production Deployment scripts

```bash
# 1. Build optimized Alpine Images
docker build -t pacs-backend:latest ./backend
docker build -t pacs-frontend:latest ./frontend

# 2. Deploy to Kubernetes
kubectl apply -f k8s/

### ☸️ Option C: Run Auto GKE Production Deployment scripts (.sh)

# 1. Authenticate (If not already)
gcloud auth login
gcloud config set project my-project-01234567

## 2. Deploy the Stack
# These scripts use "Smart Search" to find your .env in the parent directory
./backend/deploy-backend.sh
./frontend/deploy-frontend.sh

### ⏪ How to Rollback
If a deployment fails, you can revert to a previous version by finding the previous `TAG` in Artifact Registry and running:
`kubectl set image deployment/pacs-backend pacs-api=REGION-docker.pkg.dev/PROJECT/REPO/IMAGE:PREVIOUS_TAG`

### 📝 Disclaimer
**FOR DEMONSTRATION PURPOSES ONLY.** All data within this portal, including names, MRNs, and medical history, is purely fictitious and generated via the **Faker** library. Any medical images displayed are anonymized test samples. This system is **not HIPAA-compliant** and is intended solely to showcase the integration of **GKE Clusters**, **Ingress IP networking**, **CloudSQL (PostgreSQL)**, and **PgCat** proxying.