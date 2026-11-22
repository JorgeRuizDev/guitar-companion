import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('EmbedLinkGenerator Component & Integration (basic-note-trainer)', () => {
  it('ensures EmbedLinkGenerator component exists and has mode, types, direction, view, and language controls', () => {
    const filePath = join(process.cwd(), 'src/apps/basic-note-trainer/components/EmbedLinkGenerator.tsx');
    const content = readFileSync(filePath, 'utf-8');

    // Title and labels
    expect(content).toContain('Generador de Enlaces y Modo Embed para Apps');
    expect(content).toContain('Link Generator & Embed Webview Mode');
    expect(content).toContain('Modo de Entrenamiento');
    expect(content).toContain('Dirección de Notación');
    expect(content).toContain('Tipo de Vista');
    expect(content).toContain('Idioma del Enlace');

    // Mode options
    expect(content).toContain('mixed');
    expect(content).toContain('translation');
    expect(content).toContain('accidentals');
    expect(content).toContain('intervals');

    // Mixed mode exercise types
    expect(content).toContain('Ejercicios combinados en modo Mixto');
    expect(content).toContain('toggleExerciseType');

    // URL & actions
    expect(content).toContain('generateEmbedUrl');
    expect(content).toContain('handleCopy');
    expect(content).toContain('Practicar con esta selección');
    expect(content).toContain('Abrir vista previa');
  });

  it('ensures BasicNoteTrainerContainer includes EmbedLinkGenerator and passes state handlers', () => {
    const filePath = join(process.cwd(), 'src/apps/basic-note-trainer/components/BasicNoteTrainerContainer.tsx');
    const content = readFileSync(filePath, 'utf-8');

    expect(content).toContain('EmbedLinkGenerator');
    expect(content).toContain('handleApplyConfigFromGenerator');
    expect(content).toContain('exerciseTypes');
    expect(content).toContain('activeExerciseTypes={exerciseTypes}');
  });
});
