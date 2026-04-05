import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Download, Maximize2, BookOpen } from "lucide-react";

const resources = [
  { id: 1, title: "Machine Learning Basics", author: "Dr. Smith", pages: 124, color: "from-blue-400 to-cyan-400" },
  { id: 2, title: "React Design Patterns", author: "Prof. Johnson", pages: 89, color: "from-rose-400 to-pink-500" },
  { id: 3, title: "Data Structures & Algorithms", author: "Dr. Williams", pages: 256, color: "from-violet-400 to-purple-500" },
];

// Mock page content
const pageContent = [
  { heading: "Chapter 1: Introduction to Machine Learning", body: "Machine learning is a subset of artificial intelligence that provides systems the ability to automatically learn and improve from experience without being explicitly programmed. This chapter covers the fundamental concepts and terminology used throughout the field.\n\nThe key types of machine learning include:\n\n1. Supervised Learning - Training with labeled data\n2. Unsupervised Learning - Finding patterns in unlabeled data\n3. Reinforcement Learning - Learning through trial and error\n\nWe will explore each of these paradigms in detail throughout this book, with practical examples and implementations." },
  { heading: "Chapter 1.1: Historical Context", body: "The history of machine learning dates back to the 1950s when Alan Turing proposed the concept of machines that could think. The field has evolved dramatically over the decades:\n\n• 1950s-60s: Early AI and first neural networks\n• 1970s-80s: Expert systems and knowledge-based AI\n• 1990s: Statistical approaches and support vector machines\n• 2000s: Ensemble methods and practical ML applications\n• 2010s: Deep learning revolution\n• 2020s: Foundation models and generative AI\n\nToday, machine learning powers everything from recommendation systems to autonomous vehicles." },
  { heading: "Chapter 2: Key Algorithms", body: "In this chapter, we explore the fundamental algorithms that form the backbone of machine learning practice:\n\nLinear Regression: The simplest form of supervised learning, used to predict continuous outputs based on input features. Despite its simplicity, linear regression remains one of the most widely used algorithms in practice.\n\nDecision Trees: A tree-structured model that makes decisions based on feature values. Easy to interpret and visualize, making them popular for classification tasks.\n\nRandom Forests: An ensemble of decision trees that reduces overfitting and improves generalization through the wisdom of crowds." },
];

export default function EbookReader() {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const resource = resources.find(r => r.id === parseInt(resourceId)) || resources[0];

  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  const totalMockPages = pageContent.length;
  const content = pageContent[(currentPage - 1) % totalMockPages];

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Top toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2.5 flex items-center gap-3 shrink-0">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors mr-2">
          <ArrowLeft size={14} /> Back
        </button>
        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${resource.color} flex items-center justify-center shrink-0`}>
          <BookOpen size={13} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{resource.title}</p>
          <p className="text-gray-400 text-[10px]">{resource.author}</p>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          {/* Zoom controls */}
          <button onClick={() => setZoom(Math.max(60, zoom - 10))} className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
            <ZoomOut size={13} />
          </button>
          <span className="text-gray-300 text-xs w-10 text-center">{zoom}%</span>
          <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
            <ZoomIn size={13} />
          </button>
          <button onClick={() => setZoom(100)} className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white flex items-center justify-center transition-colors ml-1">
            <RotateCcw size={12} />
          </button>
          <button className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
            <Download size={13} />
          </button>
          <button className="w-7 h-7 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-white flex items-center justify-center transition-colors">
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* Main reader area */}
      <div className="flex-1 overflow-y-auto flex items-start justify-center p-6 bg-gray-800">
        <div
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full transition-all duration-200"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", minHeight: "700px" }}
        >
          {/* Page header */}
          <div className={`h-3 bg-gradient-to-r ${resource.color} rounded-t-lg`} />
          <div className="p-10">
            <div className="text-xs text-gray-400 mb-6 flex items-center justify-between">
              <span>{resource.title}</span>
              <span>Page {currentPage} of {resource.pages}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-4 leading-snug">{content.heading}</h1>
            <div className="prose prose-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {content.body}
            </div>
          </div>

          {/* Page footer */}
          <div className="px-10 pb-6">
            <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs text-gray-300">
              <span>{resource.author}</span>
              <span>{currentPage}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="bg-gray-800 border-t border-gray-700 px-4 py-3 flex items-center justify-between shrink-0">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} /> Previous
        </button>

        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-xs">Page</span>
          <input
            type="number"
            min="1"
            max={resource.pages}
            value={currentPage}
            onChange={(e) => setCurrentPage(Math.max(1, Math.min(resource.pages, parseInt(e.target.value) || 1)))}
            className="w-12 text-center text-xs bg-gray-700 text-white border border-gray-600 rounded-lg py-1 outline-none focus:border-blue-500"
          />
          <span className="text-gray-400 text-xs">of {resource.pages}</span>
        </div>

        {/* Progress bar */}
        <div className="hidden sm:flex items-center gap-2 flex-1 mx-6">
          <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${resource.color} transition-all duration-300`} style={{ width: `${(currentPage / resource.pages) * 100}%` }} />
          </div>
          <span className="text-[10px] text-gray-400">{Math.round((currentPage / resource.pages) * 100)}%</span>
        </div>

        <button
          onClick={() => setCurrentPage(Math.min(resource.pages, currentPage + 1))}
          disabled={currentPage === resource.pages}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
