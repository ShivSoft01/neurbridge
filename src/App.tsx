import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/auth/PrivateRoute';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GameCenter from './components/GameCenter';
import CalmZone from './components/CalmZone';
import AIAssistant from './components/AIAssistant';
import AIChatSelection from './components/AIChatSelection';
import VirtualTeacher from './components/VirtualTeacher';
import FocusForest from './components/games/FocusForest';
import BubbleFocusPop from './components/games/BubbleFocusPop';
import WordBuilderIsland from './components/games/WordBuilderIsland';
import EmotionExplorer from './components/games/EmotionExplorer';
import MathGalaxyRescue from './components/games/MathGalaxyRescue';
import TimeTurtle from './components/games/TimeTurtle';
import MemoryMatchMe from './components/games/MemoryMatchMe';
import CreativeQuest from './components/games/CreativeQuest';
import BreatheWithMe from './components/games/BreatheWithMe';
import TaskTrackerQuest from './components/games/TaskTrackerQuest';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AccountSettings from './components/AccountSettings';
import { theme } from './theme';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex h-screen">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <Dashboard />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/account-settings"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <AccountSettings />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/games"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <GameCenter />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/calm-zone"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <CalmZone />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/ai-chat"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <AIChatSelection />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/ai-chat/teacher"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <VirtualTeacher />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/ai-chat/support"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <AIAssistant />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/games/focus-forest"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <FocusForest />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/games/bubble-focus"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <BubbleFocusPop />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/games/word-builder"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <WordBuilderIsland />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/games/emotion-explorer"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <EmotionExplorer />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/games/math-galaxy"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <MathGalaxyRescue />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/games/time-turtle"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <TimeTurtle />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/games/memory-match"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <MemoryMatchMe />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/games/creative-quest"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <CreativeQuest />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/games/breathe-with-me"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <BreatheWithMe />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/games/task-tracker"
              element={
                <PrivateRoute>
                  <div className="flex flex-1">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto" style={{ backgroundColor: theme.primary, boxShadow: theme.shadow.sidebar }}>
                      <TaskTrackerQuest />
                    </main>
                  </div>
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;