# FitExpert Studio ⚡

> **Plataforma Integral de Fitness, Nutrición y Rutinas Respaldada por Evidencia Científica (ISSN / ACSM / Peer-Reviewed)**

---

## 🌟 Características Principales

1. **Calculadora Diagnóstica Metabólica**:
   - Ecuaciones de **Mifflin-St Jeor** y **Katch-McArdle** (% grasa corporal magra).
   - Cálculo automático de BMR, TDEE y ajuste de Déficit (-20% moderado / -25% agresivo) o Superávit (+12%).
   - Distribución de Macronutrientes en base al posicionamiento de la **ISSN 2017** (Proteína elevada de 2.2g/kg para preservar masa muscular).

2. **Rutinas & Tracker de Sobrecarga Progresiva**:
   - Plantillas preconfiguradas basadas en evidencia (**Push/Pull/Legs** y **Torso/Pierna**).
   - Fichas biomecánicas por ejercicio con objetivos de **RPE** (Rating of Perceived Exertion).
   - Calculadora y gráfico en tiempo real de **Volumen Total Cargado** ($Series \times Reps \times Peso$).

3. **Planificador de Menús Semanales & Lista de la Compra**:
   - Menú interactivo de 7 días (Desayuno, Comida, Merienda, Cena) ajustado a los macronutrientes.
   - Generación automatizada de la **Lista de la Compra Semanal**.

4. **Hub de Evidencia Científica**:
   - Artículos divulgativos con citas académicas de las principales revistas de biomecánica y endocrinología.

---

## 🚀 Despliegue Automatizado con GitHub & Cloudflare Pages

Esta aplicación está 100% optimizada para ser desplegada en **Cloudflare Pages** directamente desde tu repositorio de GitHub con **actualizaciones automáticas (CI/CD)** cada vez que hagas `git push`.

### Paso 1: Inicializar el repositorio Git local
Ejecuta en tu terminal dentro de esta carpeta:
```bash
git init
git add .
git commit -m "Initial commit - FitExpert Studio v1.0"
```

### Paso 2: Crear el repositorio en GitHub y vinculare
1. Ve a [GitHub](https://github.com/new) y crea un nuevo repositorio público o privado llamado `fitexpert-studio`.
2. Ejecuta en la terminal (reemplazando `TU_USUARIO`):
```bash
git remote add origin https://github.com/TU_USUARIO/fitexpert-studio.git
git branch -M main
git push -u origin main
```

### Paso 3: Conectar a Cloudflare Pages para Actualización Automática
1. Entra a tu panel de [Cloudflare Dashboard](https://dash.cloudflare.com/) -> **Workers & Pages**.
2. Haz clic en **Create Application** -> Pestaña **Pages** -> **Connect to Git**.
3. Selecciona tu repositorio `fitexpert-studio`.
4. Configura los parámetros de build:
   - **Framework preset**: None (Static HTML/JS).
   - **Build command**: (Déjalo en blanco / vacío).
   - **Build output directory**: `.` (o dejar por defecto).
5. Haz clic en **Save and Deploy**.

¡Listo! Tu aplicación estará publicada al instante con un dominio `.pages.dev` gratuito y certificado SSL automático. Cada cambio que subas a GitHub actualizará la web en vivo en segundos.
