# AI Diagnostic Assistant

An AI-powered healthcare application that provides symptom analysis, disease prediction, and chatbot support.

## Features

- 🔍 **Symptom Analysis**: Input symptoms and get disease predictions
- 🤖 **AI Chatbot**: Healthcare-focused conversational AI
- 📊 **Confidence Scoring**: Get prediction confidence levels
- 🎯 **Dataset References**: View training/testing data matches

## Tech Stack

**Backend:**

- FastAPI
- Python 3.8+
- OpenAI GPT-3.5-turbo
- Scikit-learn
- Pandas

**Frontend:**

- React.js
- Tailwind CSS
- Axios

## Installation

### Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ai-diagnostic-assistant.git
cd ai-diagnostic-assistant
```

2. Create a virtual environment:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set up environment variables:

```bash
# Create .env file in backend directory
echo "OPENAI_API_KEY=your-openai-api-key-here" > .env
```

5. Run the backend:

```bash
cd model
python main.py
```

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## Usage

1. Start the backend server (runs on `http://localhost:8001`)
2. Start the frontend server (runs on `http://localhost:3000`)
3. Access the application in your browser
4. Use the symptom form to get disease predictions
5. Chat with the AI assistant for healthcare guidance

## API Endpoints

- `GET /` - API status
- `GET /symptoms` - List available symptoms
- `POST /predict` - Predict disease from symptoms
- `POST /chat` - Chat with AI assistant

## ⚠️ Important Disclaimer

This application is for educational purposes only. Always consult healthcare professionals for medical advice.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
