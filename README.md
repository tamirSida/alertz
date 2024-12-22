# ALERTZ App Prototype

## Overview
The ALERTZ App Prototype is a web application designed to help users stay safe with real-time missile alerts and guidance. The app provides the location of the nearest shelter during an attack and prompts the user to confirm their safety. If the user does not respond within a specified time, emergency services are dispatched to their location.

## Features
- Real-time missile alerts
- Directions to the nearest shelter
- Language support (English, Hebrew, Russian)
- Light/Dark mode toggle
- Font size toggle
- Emergency services dispatch

## Installation

### Prerequisites
- Python 3.x
- pip (Python package installer)

### Steps
1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/alertz-app.git
    cd alertz-app
    ```

2. Create a virtual environment:
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3. Install the required packages:
    ```sh
    pip install -r requirements.txt
    ```

4. Create a `.env` file in the root of the project and add your Mapbox API key:
    ```env
    MAPBOX_API_KEY='your_mapbox_api_key_here'
    ```

5. Ensure the `.env` file is added to `.gitignore` to prevent it from being pushed to GitHub:
    ```gitignore
    .env
    ```

## Usage
1. Run the Flask application:
    ```sh
    python app.py
    ```

2. Open your web browser and navigate to `http://127.0.0.1:5000/`.

## Project Structure
- `app.py`: The main Flask application file.
- `templates/index.html`: The HTML template for the app.
- `static/script.js`: The JavaScript file for the app's functionality.
- `static/styles.css`: The CSS file for the app's styling.
- `requirements.txt`: The file containing the list of required Python packages.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.
