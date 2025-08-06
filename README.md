# MindBridge: Your Private AI Wellness Desktop App

## 💡 Project Description
**MindBridge** is a cross-platform desktop application designed to be your private, AI-powered companion for mental wellness and productivity. Built with Electron, it offers a secure and accessible space for users to reflect on their feelings, manage tasks, and track their time. By leveraging a locally hosted Gemma 3n model via Ollama, all interactions and data remain entirely on your device, ensuring absolute privacy.

## ✨ Features
-   **Privacy-First AI Chat:** Chat with an AI wellness coach powered by a local Gemma 3n model. All conversations are processed on-device, ensuring your data remains private.
-   **Integrated Productivity Tools:**
    -   **Daily Log:** A robust and private space to capture and organize your thoughts and reflections, with enhanced saving and retrieval capabilities and AI Insights.
-   **Modern Desktop UI:**
    -   A clean, warm, and inviting interface with a sidebar for easy navigation.
    -   A central dashboard to welcome you to the application.
-   **Cross-Platform:** As an Electron app, it can be built for Windows, macOS, and Linux.

## 🚀 Technologies Used
-   **Core Framework:** Electron
-   **Frontend:** HTML, CSS, JavaScript
-   **Backend Logic (Electron Main Process):** Node.js
-   **AI Model:** Gemma 3n (via Ollama)
-   **Notifications:**
    -   Electron Native Notifications

## ⚙️ Setup and Installation

### Prerequisites
1.  **Node.js and npm:** Ensure you have Node.js (v18 or higher recommended) and npm installed.
2.  **Ollama:** Download and install Ollama from [ollama.com](https://ollama.com/).
3.  **Gemma 3n Model:** Once Ollama is installed, pull the Gemma 3n model. Open your terminal and run:
    ```bash
    ollama run gemma3n:e2b-it-q4_K_M
    ```
    This command will download the model if you don't have it already. Ensure Ollama is running in the background.

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/N-45div/MindBridge.git
    cd MindBridge
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the application:**
    ```bash
    npm start
    ```
    The MindBridge desktop application will launch.

## 📱 Usage
1.  **Dashboard:** Upon launching, you'll see the main dashboard.
2.  **Navigate:** Use the sidebar to switch between the Dashboard, Chat, and Daily Log.
3.  **AI Chat:** Open the Chat view to talk with your private wellness coach.
4.  **Daily Log:** Use the Daily Log to jot down your thoughts. Logs are saved locally.


## 📄 License
This project is open-source and available under the [MIT License](LICENSE).