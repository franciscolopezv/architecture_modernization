import React from 'react';
import { useEffect } from 'react';

export default function Root({ children }) {
  useEffect(() => {
    // Add zoom and pan functionality to Mermaid diagrams
    const initMermaidZoom = () => {
      const containers = document.querySelectorAll('.docusaurus-mermaid-container');
      
      containers.forEach((container) => {
        // Clean up existing listeners if re-initializing
        if (container._cleanup) {
          container._cleanup();
          delete container.dataset.zoomInitialized;
        }
        
        // Skip if already initialized
        if (container.dataset.zoomInitialized) return;
        container.dataset.zoomInitialized = 'true';

        const svg = container.querySelector('svg');
        if (!svg) return;

        let scale = 1;
        let panning = false;
        let pointX = 0;
        let pointY = 0;
        let start = { x: 0, y: 0 };

        // Set initial transform
        svg.style.transformOrigin = 'center center';
        svg.style.transition = 'transform 0.1s ease-out';

        // Zoom with Ctrl+Scroll or pinch
        const handleWheel = (e) => {
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.min(Math.max(0.3, scale * delta), 5);
            
            scale = newScale;
            svg.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
          }
        };

        // Pan with mouse drag
        const handleMouseDown = (e) => {
          e.preventDefault();
          start = { x: e.clientX - pointX, y: e.clientY - pointY };
          panning = true;
          container.style.cursor = 'grabbing';
        };

        const handleMouseMove = (e) => {
          if (!panning) return;
          e.preventDefault();
          
          pointX = e.clientX - start.x;
          pointY = e.clientY - start.y;
          svg.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
        };

        const handleMouseUp = () => {
          panning = false;
          container.style.cursor = 'grab';
        };

        // Touch support for mobile
        let initialDistance = 0;
        let initialScale = 1;

        const handleTouchStart = (e) => {
          if (e.touches.length === 2) {
            e.preventDefault();
            initialDistance = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
            );
            initialScale = scale;
          } else if (e.touches.length === 1) {
            start = { x: e.touches[0].clientX - pointX, y: e.touches[0].clientY - pointY };
            panning = true;
          }
        };

        const handleTouchMove = (e) => {
          if (e.touches.length === 2) {
            e.preventDefault();
            const distance = Math.hypot(
              e.touches[0].clientX - e.touches[1].clientX,
              e.touches[0].clientY - e.touches[1].clientY
            );
            const newScale = Math.min(Math.max(0.3, initialScale * (distance / initialDistance)), 5);
            scale = newScale;
            svg.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
          } else if (e.touches.length === 1 && panning) {
            e.preventDefault();
            pointX = e.touches[0].clientX - start.x;
            pointY = e.touches[0].clientY - start.y;
            svg.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
          }
        };

        const handleTouchEnd = () => {
          panning = false;
        };

        // Double-click to reset
        const handleDoubleClick = () => {
          scale = 1;
          pointX = 0;
          pointY = 0;
          svg.style.transform = 'translate(0px, 0px) scale(1)';
        };

        // Add event listeners
        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('mousedown', handleMouseDown);
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseup', handleMouseUp);
        container.addEventListener('mouseleave', handleMouseUp);
        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);
        container.addEventListener('dblclick', handleDoubleClick);

        // Store cleanup function
        container._cleanup = () => {
          container.removeEventListener('wheel', handleWheel);
          container.removeEventListener('mousedown', handleMouseDown);
          container.removeEventListener('mousemove', handleMouseMove);
          container.removeEventListener('mouseup', handleMouseUp);
          container.removeEventListener('mouseleave', handleMouseUp);
          container.removeEventListener('touchstart', handleTouchStart);
          container.removeEventListener('touchmove', handleTouchMove);
          container.removeEventListener('touchend', handleTouchEnd);
          container.removeEventListener('dblclick', handleDoubleClick);
        };
      });
    };

    // Initialize on mount and when content changes
    initMermaidZoom();

    // Re-initialize when navigating between pages or theme changes
    const observer = new MutationObserver((mutations) => {
      // Check if theme changed or content changed
      const shouldReinit = mutations.some(mutation => {
        // Check for theme changes
        if (mutation.target === document.documentElement && 
            mutation.attributeName === 'data-theme') {
          return true;
        }
        // Check for content changes (new diagrams)
        if (mutation.addedNodes.length > 0) {
          return Array.from(mutation.addedNodes).some(node => {
            if (node.nodeType === 1) { // Element node
              return node.classList?.contains('docusaurus-mermaid-container') ||
                     node.querySelector?.('.docusaurus-mermaid-container');
            }
            return false;
          });
        }
        return false;
      });
      
      if (shouldReinit) {
        // Small delay to ensure DOM is ready after theme change
        setTimeout(initMermaidZoom, 100);
      }
    });

    // Observe both body for content changes and html for theme changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      // Cleanup all containers
      document.querySelectorAll('.docusaurus-mermaid-container').forEach((container) => {
        if (container._cleanup) {
          container._cleanup();
          delete container.dataset.zoomInitialized;
        }
      });
    };
  }, []);

  return <>{children}</>;
}
