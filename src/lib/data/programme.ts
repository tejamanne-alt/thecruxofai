import type { GroupId } from './curriculum'

/** All brochure-derived. Nothing here is invented to fill a gap. */

export const progFacts = [
  { k: 'Duration', v: '4 semesters', note: 'Minimum two years, alongside full-time work.' },
  { k: 'Course load', v: '12 courses', note: 'Four in each of the first three semesters.' },
  { k: 'Live instruction', v: '32 hours', note: 'Per course, on weekends, interactive.' },
  { k: 'Final semester', v: 'Dissertation', note: 'A workplace project or industry dissertation.' },
]

export const delivery = [
  {
    title: 'Live weekend sessions',
    body: '32 hours of live instruction per course, taught interactively rather than recorded, plus faculty feedback on case studies and assignments.',
  },
  {
    title: 'Virtual and remote labs',
    body: 'Cloud-hosted AI/ML platforms — TensorFlow, PyTorch, Keras — on GPU clusters, plus physical equipment operated remotely.',
  },
  {
    title: 'Campus immersion',
    body: 'Curated modules on a BITS campus: face-to-face faculty time, lab work and peer networking.',
  },
  {
    title: 'Self-paced material',
    body: 'Recorded sessions, e-learning content and assignments on the LMS, plus eBook and journal access through OpenAthens.',
  },
  {
    title: 'Flexible pacing',
    body: "You can pause for personal or professional commitments and resume where you left off, with your programme co-ordinator's advice.",
  },
]

export const objectives = [
  'Build strong foundations in AI, machine learning, deep learning and mathematical reasoning.',
  'Develop expertise in generative AI, LLMs, agentic AI and multimodal systems.',
  'Design, deploy and manage scalable production-grade AI systems using MLOps and cloud-native technology.',
  'Build intelligent solutions across NLP, computer vision, robotics, edge AI and conversational AI.',
  'Work in secure, responsible and research-driven AI for real industry problems.',
]

export const tools = [
  {
    area: 'Deep learning',
    list: 'PyTorch, TensorFlow, Keras, Scikit-learn · CNN, RNN, Transformers · TF-Agents, Stable Baselines3',
  },
  {
    area: 'NLP & RAG',
    list: 'NLTK, spaCy, Transformers, Hugging Face · BERT, GPT, T5, Llama, Mistral, Gemma, Qwen · LangChain, LlamaIndex, Haystack, Ragas · FAISS, Pinecone, Weaviate, ChromaDB, Neo4j',
  },
  {
    area: 'Computer vision & video',
    list: 'OpenCV, torchvision · YOLO, ResNet, RAFT, DeepSORT · ViViT, VideoMAE, CLIP · Hugging Face Diffusers',
  },
  { area: 'Audio & speech', list: 'Librosa, NumPy, SciPy, Matplotlib · Whisper, Wav2Vec2, CLAP' },
  {
    area: 'Agentic & multimodal',
    list: 'LangChain, AutoGen · Gemini 2.5 Pro, Qwen2.5-VL, Llama 3.2 Vision · Hugging Face, Ollama, vLLM',
  },
  { area: 'Robotics & RL', list: 'ROS2, Python Robotics · Gymnasium, Gazebo, RViz · PyBullet, MuJoCo' },
  {
    area: 'MLOps',
    list: 'MLflow, Kubeflow, Airflow, Prefect, DVC · Docker, Kubernetes · FastAPI, PyTest, Evidently AI · Git',
  },
  {
    area: 'Cloud & APIs',
    list: 'AWS Lambda, API Gateway, CloudWatch · SageMaker, Bedrock, Bedrock Studio · IAM, OpenAI APIs',
  },
]

export const assessCards = [
  {
    title: 'Continuous assessment',
    body: 'Quizzes and assignments through the term, then the mid-semester and comprehensive exams for each course.',
  },
  {
    title: 'Case studies & assignments',
    body: 'Real-world cases used as in-class problem-solving exercises, with faculty feedback on what you submit.',
  },
  {
    title: 'Dissertation / project work',
    body: 'Semester 4: apply everything to one complex real problem and show command of the concepts.',
  },
]

export const examRules = [
  'Semesters 1 to 3 each carry a mid-semester and a comprehensive exam per course.',
  'In-person exams are mostly held on a Friday, Saturday or Sunday at a designated centre.',
  'Quizzes and assignments run online through the LMS.',
  'Exam centres span north, west, south and east zones in India, with international centres including Dubai, Abu Dhabi, Doha and Singapore.',
  'EC-2 and EC-3 exams may not run in every listed city; you can be moved to an alternate centre.',
  'Semester 4 is dissertation or project work, assessed per the published guidelines.',
]

export const semCards: Array<{
  group: GroupId
  kicker: string
  title: string
  detail: string
  dark?: boolean
}> = [
  {
    group: 's1',
    kicker: 'Semester 1',
    title: 'Foundations',
    detail: 'Maths, statistics, computational intelligence and machine learning.',
    dark: true,
  },
  {
    group: 's2',
    kicker: 'Semester 2',
    title: 'Deep learning',
    detail: 'Deep neural networks, deep RL, and your first two electives.',
  },
  {
    group: 'eg',
    kicker: 'Semester 3',
    title: 'Four electives',
    detail: 'Specialise: NLP, audio and vision, deep learning or the general pool.',
  },
  {
    group: 's4',
    kicker: 'Semester 4',
    title: 'Dissertation',
    detail: 'One real project from work, carried end to end.',
  },
]

/** The whole-course cheat sheet: one card per idea, across everything so far. */
export const wholeCourseFormulas = [
  {
    topic: 'Linear regression',
    formula: 'ŷ = wx + b · MSE = (1/n) Σ(ŷ−y)²',
    why: 'One straight line, judged by average squared miss.',
  },
  { topic: 'Gradient descent', formula: 'w ← w − η ∂J/∂w', why: 'Step against the slope. η too large diverges.' },
  {
    topic: 'k-means',
    formula: 'J = Σⱼ Σ 𝑥∈Cⱼ ‖x − μⱼ‖²',
    why: 'Assign to nearest centroid, move centroid to mean, repeat.',
  },
  {
    topic: 'Perceptron',
    formula: 'ŷ = sign(w·x + b); w ← w + η y x on error',
    why: 'Only updates when it is wrong. Converges iff separable.',
  },
  {
    topic: 'Classification metrics',
    formula: 'P = TP/(TP+FP) · R = TP/(TP+FN) · F1 = 2PR/(P+R)',
    why: 'Precision guards against false alarms, recall against misses.',
  },
  {
    topic: 'Bias–variance',
    formula: 'Err = bias² + variance + noise',
    why: 'Underfit vs overfit, and the part you can never remove.',
  },
]

/** Recall cards for the night before. Answer out loud first, then flip. */
export const recallCards: Array<[string, string]> = [
  [
    'Why square the errors instead of just adding them up?',
    'So over- and under-shooting both count as bad, and one big miss hurts much more than several small ones.',
  ],
  [
    'What does the learning rate actually control?',
    'How far you move along the downhill direction each step. Too big overshoots and diverges, too small crawls.',
  ],
  [
    'Why can k-means give a different answer each run?',
    'The two steps only guarantee a local minimum, so the starting positions of the centroids decide which one you land in.',
  ],
  [
    'How do you pick k?',
    'You do not get it from the algorithm — use the elbow of the inertia curve or the silhouette score, plus domain sense.',
  ],
  [
    'What can a single perceptron never learn?',
    'Anything not linearly separable. XOR is the classic counter-example; hidden layers fix it.',
  ],
  [
    'Bias vs variance in one line each?',
    'High bias: too simple, wrong everywhere the same way. High variance: too flexible, memorises the training noise.',
  ],
]

export const howToUse = [
  {
    title: 'How to use it before an exam',
    body: 'Open a topic and break it on purpose — set a huge step size, or the wrong k. Then read the cheat sheet card for it. Watching it go wrong is what makes the formula stick.',
  },
  {
    title: 'How to use it with a friend',
    body: 'Say out loud what the dots and lines are doing before you look at any formula. Only open the list of symbols when you get stuck.',
  },
  {
    title: 'Growing each weekend',
    body: '32 hours of live teaching per course, on weekends. Every session that happens becomes a page under its course in the menu.',
  },
]
