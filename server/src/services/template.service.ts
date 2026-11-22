import fs from 'fs';
import path from 'path';
import { ProjectTemplate } from '@syncwrite/shared';
import { safePath } from '../utils/fileSystem';
import { FileModel } from '../models/File';
import { generateId } from '../utils/uuid';

interface TemplateDefinition extends ProjectTemplate {
  fileContents: Record<string, string>;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'python-flask',
    name: 'Python Flask API',
    language: 'python',
    description: 'REST API with Flask, including routes and error handling',
    files: ['app.py', 'requirements.txt', 'README.md'],
    runCommand: 'python app.py',
    icon: '🐍',
    fileContents: {
      'app.py': `from flask import Flask, jsonify, request

app = Flask(__name__)

todos = [
    {"id": 1, "task": "Learn SyncWrite", "done": True},
    {"id": 2, "task": "Build collaborative app", "done": False}
]

@app.route("/")
def home():
    return jsonify({
        "message": "Welcome to SyncWrite Python Flask API!",
        "version": "1.0.0"
    })

@app.route("/api/todos", methods=["GET"])
def get_todos():
    return jsonify(todos)

@app.route("/api/todos", methods=["POST"])
def add_todo():
    data = request.json or {}
    new_todo = {
        "id": len(todos) + 1,
        "task": data.get("task", "New Task"),
        "done": False
    }
    todos.append(new_todo)
    return jsonify(new_todo), 201

if __name__ == "__main__":
    print("Flask server running on http://127.0.0.1:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
`,
      'requirements.txt': `flask==3.0.3
`,
      'README.md': `# Python Flask API

A lightweight Flask REST API template ready to run inside SyncWrite.

## Running
Run:
\`\`\`bash
pip install -r requirements.txt
python app.py
\`\`\`
`,
    },
  },
  {
    id: 'python-fastapi',
    name: 'Python FastAPI',
    language: 'python',
    description: 'Modern async API with FastAPI and Uvicorn',
    files: ['main.py', 'requirements.txt', 'README.md'],
    runCommand: 'uvicorn main:app --reload',
    icon: '⚡',
    fileContents: {
      'main.py': `from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI(title="SyncWrite FastAPI", version="1.0.0")

class Item(BaseModel):
    name: str
    price: float
    is_offer: bool = False

items = []

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI on SyncWrite!"}

@app.get("/items", response_model=List[Item])
def get_items():
    return items

@app.post("/items")
def create_item(item: Item):
    items.append(item)
    return item
`,
      'requirements.txt': `fastapi==0.111.0
uvicorn==0.30.1
pydantic==2.7.4
`,
      'README.md': `# Python FastAPI

High-performance async Python backend with FastAPI and Uvicorn.

## Running
\`\`\`bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
\`\`\`
`,
    },
  },
  {
    id: 'node-express',
    name: 'Node.js Express API',
    language: 'javascript',
    description: 'Express REST API with middleware and routing',
    files: ['index.js', 'package.json', 'README.md'],
    runCommand: 'node index.js',
    icon: '🟢',
    fileContents: {
      'index.js': `const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const notes = [
  { id: 1, title: 'SyncWrite Notes', body: 'Collaborate in real-time.' }
];

app.get('/', (req, res) => {
  res.json({ message: 'SyncWrite Node.js Express server is running!' });
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = { id: notes.length + 1, ...req.body };
  notes.push(newNote);
  res.status(201).json(newNote);
});

app.listen(PORT, () => {
  console.log(\`Server listening on http://localhost:\${PORT}\`);
});
`,
      'package.json': `{
  "name": "node-express-project",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "express": "^4.19.2"
  }
}
`,
      'README.md': `# Node.js Express API

Express REST service running on Node.js.

## Running
\`\`\`bash
npm install
node index.js
\`\`\`
`,
    },
  },
  {
    id: 'react-app',
    name: 'React Application',
    language: 'javascript',
    description: 'React app with Vite, components, and routing',
    files: ['src/App.jsx', 'src/main.jsx', 'index.html', 'package.json', 'vite.config.js', 'README.md'],
    runCommand: 'npm run dev',
    icon: '⚛️',
    fileContents: {
      'src/App.jsx': `import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to React on SyncWrite</h1>
      <p>Edit <code>src/App.jsx</code> and save to reload.</p>
      <button
        style={{ padding: '0.5rem 1rem', fontSize: '1rem', cursor: 'pointer' }}
        onClick={() => setCount((c) => c + 1)}
      >
        Count is: {count}
      </button>
    </div>
  );
}
`,
      'src/main.jsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
      'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`,
      'package.json': `{
  "name": "react-vite-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.2.11"
  }
}
`,
      'vite.config.js': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`,
      'README.md': `# React Application

Vite-powered React boilerplate.

## Running
\`\`\`bash
npm install
npm run dev
\`\`\`
`,
    },
  },
  {
    id: 'go-gin',
    name: 'Go Gin API',
    language: 'go',
    description: 'REST API with Gin framework',
    files: ['main.go', 'go.mod', 'README.md'],
    runCommand: 'go run main.go',
    icon: '🐹',
    fileContents: {
      'main.go': `package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello from Go Gin on SyncWrite!",
			"status":  "healthy",
		})
	})

	r.Run(":8080")
}
`,
      'go.mod': `module syncwrite-go-project

go 1.21

require github.com/gin-gonic/gin v1.9.1
`,
      'README.md': `# Go Gin REST API

High performance Go web framework.

## Running
\`\`\`bash
go run main.go
\`\`\`
`,
    },
  },
  {
    id: 'rust-actix',
    name: 'Rust Actix Web',
    language: 'rust',
    description: 'Web server with Actix-web framework',
    files: ['src/main.rs', 'Cargo.toml', 'README.md'],
    runCommand: 'cargo run',
    icon: '🦀',
    fileContents: {
      'src/main.rs': `use actix_web::{get, App, HttpResponse, HttpServer, Responder};

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello from Rust Actix on SyncWrite!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Rust Actix server listening on 127.0.0.1:8080");
    HttpServer::new(|| {
        App::new().service(hello)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
`,
      'Cargo.toml': `[package]
name = "syncwrite_rust_project"
version = "0.1.0"
edition = "2021"

[dependencies]
actix-web = "4"
`,
      'README.md': `# Rust Actix Web

Blazingly fast, type-safe web service in Rust.

## Running
\`\`\`bash
cargo run
\`\`\`
`,
    },
  },
  {
    id: 'java-spring',
    name: 'Java Spring Boot',
    language: 'java',
    description: 'Spring Boot REST API',
    files: ['src/Main.java', 'pom.xml', 'README.md'],
    runCommand: 'javac src/Main.java && java -cp src Main',
    icon: '☕',
    fileContents: {
      'src/Main.java': `public class Main {
    public static void main(String[] args) {
        System.out.println("=== SyncWrite Java Application ===");
        System.out.println("Java runtime version: " + System.getProperty("java.version"));
        System.out.println("Ready to compile and run!");
    }
}
`,
      'pom.xml': `<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.syncwrite</groupId>
    <artifactId>app</artifactId>
    <version>1.0.0</version>
    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>
</project>
`,
      'README.md': `# Java Application

Java template with compilation support.

## Running
\`\`\`bash
javac src/Main.java
java -cp src Main
\`\`\`
`,
    },
  },
  {
    id: 'c-project',
    name: 'C Project',
    language: 'c',
    description: 'C project with Makefile and header files',
    files: ['src/main.c', 'include/main.h', 'Makefile', 'README.md'],
    runCommand: 'make && ./build/main',
    icon: '🔧',
    fileContents: {
      'src/main.c': `#include <stdio.h>
#include "../include/main.h"

int main() {
    print_greeting("SyncWrite Developer");
    return 0;
}

void print_greeting(const char* name) {
    printf("Hello, %s! Welcome to C development on SyncWrite.\\n", name);
}
`,
      'include/main.h': `#ifndef MAIN_H
#define MAIN_H

void print_greeting(const char* name);

#endif
`,
      'Makefile': `CC = gcc
CFLAGS = -Wall -Wextra -Iinclude

all: build/main

build/main: src/main.c
	mkdir -p build
	$(CC) $(CFLAGS) src/main.c -o build/main

clean:
	rm -rf build
`,
      'README.md': `# C Project

Standard C project with header structure and Makefile.

## Running
\`\`\`bash
make
./build/main
\`\`\`
`,
    },
  },
  {
    id: 'cpp-project',
    name: 'C++ Project',
    language: 'cpp',
    description: 'C++ project with CMake build system',
    files: ['src/main.cpp', 'include/main.hpp', 'CMakeLists.txt', 'README.md'],
    runCommand: 'mkdir -p build && cd build && cmake .. && make && ./main',
    icon: '⚙️',
    fileContents: {
      'src/main.cpp': `#include <iostream>
#include <vector>
#include <string>
#include "../include/main.hpp"

int main() {
    std::cout << "=== SyncWrite C++ Modern Workshop ===" << std::endl;
    std::vector<std::string> features = {"Real-time CRDT", "Terminal PTY", "AI Intelligence"};
    for (const auto& f : features) {
        std::cout << " - " << f << std::endl;
    }
    return 0;
}
`,
      'include/main.hpp': `#pragma once
#include <string>

void greet(const std::string& user);
`,
      'CMakeLists.txt': `cmake_minimum_required(VERSION 3.15)
project(SyncWriteCpp)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

include_directories(include)
add_executable(main src/main.cpp)
`,
      'README.md': `# C++ Project

Modern C++ project with CMake build configuration.

## Running
\`\`\`bash
g++ -std=c++17 -Iinclude src/main.cpp -o main && ./main
\`\`\`
`,
    },
  },
];

export const TemplateService = {
  getAllTemplates(): ProjectTemplate[] {
    return TEMPLATES.map(({ id, name, language, description, files, runCommand, icon }) => ({
      id,
      name,
      language,
      description,
      files,
      runCommand,
      icon,
    }));
  },

  getTemplateById(id: string): TemplateDefinition | undefined {
    return TEMPLATES.find((t) => t.id === id);
  },

  applyTemplate(projectId: string, templateId: string): void {
    const template = this.getTemplateById(templateId);
    if (!template) return;

    for (const [relPath, content] of Object.entries(template.fileContents)) {
      const fullPath = safePath(projectId, relPath);
      const parentDir = path.dirname(fullPath);

      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
        // Register parent directory in DB
        const relParent = path.relative(path.dirname(safePath(projectId, 'dummy')), parentDir).replace(/\\/g, '/');
        if (relParent && relParent !== '.') {
          FileModel.create({
            id: generateId(),
            projectId,
            path: relParent,
            type: 'directory',
          });
        }
      }

      fs.writeFileSync(fullPath, content, 'utf-8');

      // Register file in DB
      FileModel.create({
        id: generateId(),
        projectId,
        path: relPath.replace(/\\/g, '/'),
        type: 'file',
        size: Buffer.byteLength(content, 'utf-8'),
      });
    }
  },
};
