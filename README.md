# FotoLab

Project Title:
Simplified Modular Photo & Graphic Editor Web App

Project Description:
Build a browser-based photo and graphic editor inspired by Photoshop but intentionally simplified. The app focuses only on the most commonly used tools by graphic designers and photographers. The goal is speed, clarity, and accessibility without overwhelming users. The system must be fully modular to support easy updates, maintainability, and future scalability.

Core Objectives:
	•	Simple, intuitive UI for fast editing
	•	High performance for large images
	•	Fully modular architecture with isolated components
	•	Clean separation between UI, logic, and processing
	•	Scalable for future premium features and plugins

Target Users:
	•	Graphic designers
	•	Photographers
	•	Content creators
	•	Print-on-demand sellers
	•	Social media managers

⸻

Core Features (MVP)

1. Image Upload Module
	•	Upload JPG, PNG, WEBP, SVG
	•	Drag-and-drop support
	•	Client-side validation for size and format
	•	Preview original image metadata

2. Canvas & Workspace Module
	•	Central canvas with zoom and pan
	•	Grid and ruler toggle
	•	Undo / redo history stack
	•	Non-destructive editing workflow

3. Resize & Dimension Module
	•	Resize by pixels, inches, centimeters, or percentages
	•	Lock aspect ratio toggle
	•	Preset dimensions (Instagram, YouTube, Print, Web, etc.)
	•	Custom dimension input

4. DPI & Resolution Module
	•	Change DPI for print and web
	•	Auto suggestions (72, 144, 300 DPI)
	•	Live preview of print quality impact
	•	Metadata update without quality loss when possible

5. Crop & Scale Module
	•	Freeform and fixed aspect ratio crop
	•	Drag handles with snapping
	•	Rotate and flip during crop
	•	Scale image proportionally or freely

6. Export Module
	•	Export to JPG, PNG, WEBP, PDF
	•	Quality slider
	•	Background transparency toggle
	•	Filename and metadata controls

⸻

Modular Architecture Requirements

Frontend Modules:
	•	UploadModule
	•	CanvasModule
	•	ResizeModule
	•	CropModule
	•	ResolutionModule
	•	ExportModule
	•	ToolbarModule
	•	HistoryModule

Each module must be independently maintainable and replaceable.

State Management:
	•	Centralized state store
	•	Each module subscribes only to relevant state
	•	Clear action-based updates

Image Processing Layer:
	•	Abstracted processing engine
	•	Supports client-side processing first
	•	Easy future swap to WebAssembly or server-side processing

UI System:
	•	Component-based UI
	•	Tool panels load dynamically
	•	Responsive design for desktop and tablet
	•	Dark and light mode

⸻

Technical Constraints
	•	Browser-based only
	•	No login required for MVP
	•	Fast load time
	•	Minimal dependencies
	•	Clean, documented codebase

⸻

Scalability & Future Expansion

Design the system so these can be added without refactoring core logic:
	•	Layer system
	•	Text tool
	•	Filters and presets
	•	AI-powered enhancements
	•	Plugin marketplace
	•	User accounts and cloud storage

⸻

Output Requirements

Generate:
	•	App architecture overview
	•	Folder structure
	•	Core component definitions
	•	State management approach
	•	Example code stubs for each module
	•	Clear comments explaining extension points

⸻

Build this app as a clean, modern, production-ready MVP optimized for clarity, speed, and modularity.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2eece38c-72d9-4aef-90fa-04d427190011).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
