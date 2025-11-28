from kivy.app import App
from kivy.uix.screenmanager import ScreenManager, Screen, FadeTransition
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.core.window import Window
from kivy.uix.scrollview import ScrollView
from kivy.properties import StringProperty, ListProperty, NumericProperty
import json
import os
import random

Window.size = (1024, 600)

CATEGORIES = [
    ("Geografía", (46/255, 204/255, 113/255, 1)),
    ("Historia", (52/255, 152/255, 219/255, 1)),
    ("Computacion", (231/255, 76/255, 60/255, 1)),
    ("Enfermeria", (41/255, 128/255, 185/255, 1)),
    ("Ingles", (155/255, 89/255, 182/255, 1)),
    ("Logica", (26/255, 188/255, 156/255, 1)),
    ("Matematicas", (243/255, 156/255, 18/255, 1)),
]

def resource_path(*parts):
    base = os.path.join(os.path.dirname(__file__), *parts)
    return base

def load_questions():
    try:
        with open(resource_path("preguntas.json"), "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print("Error cargando preguntas.json:", e)
        return {}

class MenuScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        layout = BoxLayout(orientation="vertical", padding=20, spacing=10)

        header = Label(text="[b]QuizziBrain[/b]", markup=True, font_size=32, size_hint_y=None, height=60)
        subtitle = Label(text="Selecciona una categoría para comenzar", font_size=18, size_hint_y=None, height=40)
        layout.add_widget(header)
        layout.add_widget(subtitle)

        grid = GridLayout(cols=2, spacing=10, size_hint_y=None)
        grid.bind(minimum_height=grid.setter("height"))

        for name, color in CATEGORIES:
            btn = Button(text=name, background_normal="", background_color=color, font_size=18, size_hint_y=None, height=70)
            btn.bind(on_release=self._make_open_category(name))
            grid.add_widget(btn)

        scroll = ScrollView()
        scroll.add_widget(grid)
        layout.add_widget(scroll)

        self.add_widget(layout)

    def _make_open_category(self, category):
        def callback(instance):
            app = App.get_running_app()
            app.open_quiz(category)
        return callback

class QuizScreen(Screen):
    categoria = StringProperty("")
    pregunta_texto = StringProperty("")
    opciones = ListProperty([])
    indice = NumericProperty(0)
    correctas = NumericProperty(0)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.preguntas = []
        self.selected = None

        root = BoxLayout(orientation="vertical", padding=20, spacing=10)

        self.lbl_cat = Label(text="", font_size=24, size_hint_y=None, height=40)
        root.add_widget(self.lbl_cat)

        self.lbl_preg = Label(text="", font_size=18, size_hint_y=None, height=150, halign="left", valign="top")
        self.lbl_preg.bind(size=self._update_text_width)
        root.add_widget(self.lbl_preg)

        self.options_layout = GridLayout(cols=1, spacing=10, size_hint_y=None)
        self.options_layout.bind(minimum_height=self.options_layout.setter("height"))
        scroll_opts = ScrollView(size_hint=(1, 1))
        scroll_opts.add_widget(self.options_layout)
        root.add_widget(scroll_opts)

        self.btn_next = Button(text="Responder", size_hint_y=None, height=50)
        self.btn_next.bind(on_release=self.on_responder)
        root.add_widget(self.btn_next)

        self.lbl_info = Label(text="", font_size=14, size_hint_y=None, height=30)
        root.add_widget(self.lbl_info)

        self.add_widget(root)

    def _update_text_width(self, *args):
        self.lbl_preg.text_size = (self.lbl_preg.width, None)

    def cargar_categoria(self, categoria, preguntas):
        self.categoria = categoria
        self.preguntas = list(preguntas)
        random.shuffle(self.preguntas)
        self.indice = 0
        self.correctas = 0
        self.mostrar_pregunta()

    def mostrar_pregunta(self):
        if self.indice >= len(self.preguntas):
            self.finalizar()
            return

        p = self.preguntas[self.indice]
        self.lbl_cat.text = f"Categoría: {self.categoria}"
        self.lbl_preg.text = p["pregunta"]
        self.opciones = p["opciones"]
        self.selected = None

        self.options_layout.clear_widgets()
        for idx, txt in enumerate(self.opciones):
            btn = Button(
                text=txt,
                halign="left",
                valign="middle",
                size_hint_y=None,
                height=60,
                background_normal="",
                background_color=(0.9, 0.9, 0.9, 1),
                color=(0, 0, 0, 1)
            )
            btn.bind(on_release=self._make_select(idx))
            self.options_layout.add_widget(btn)

        self.lbl_info.text = f"Pregunta {self.indice + 1} de {len(self.preguntas)}"

    def _make_select(self, idx):
        def callback(instance):
            self.selected = idx
            for child in self.options_layout.children:
                child.background_color = (0.9, 0.9, 0.9, 1)
            instance.background_color = (0.2, 0.6, 1, 1)
        return callback

    def on_responder(self, instance):
        if self.selected is None:
            self.lbl_info.text = "Selecciona una opción antes de continuar."
            return

        correcta = self.preguntas[self.indice]["respuesta"]
        if self.selected == correcta:
            self.correctas += 1

        self.indice += 1
        self.mostrar_pregunta()

    def finalizar(self):
        total = len(self.preguntas)
        self.lbl_preg.text = f"Resultado final: {self.correctas} de {total} respuestas correctas."
        self.options_layout.clear_widgets()
        self.btn_next.text = "Volver al menú"
        self.btn_next.unbind(on_release=self.on_responder)
        self.btn_next.bind(on_release=self._volver_menu)
        self.lbl_info.text = ""

    def _volver_menu(self, instance):
        app = App.get_running_app()
        app.sm.current = "menu"

class QuizziBrainKivyApp(App):
    def build(self):
        self.title = "QuizziBrain"
        self.questions = load_questions()

        self.sm = ScreenManager(transition=FadeTransition())

        self.menu_screen = MenuScreen(name="menu")
        self.quiz_screen = QuizScreen(name="quiz")

        self.sm.add_widget(self.menu_screen)
        self.sm.add_widget(self.quiz_screen)

        return self.sm

    def open_quiz(self, categoria):
        preguntas = self.questions.get(categoria)
        if not preguntas:
            print(f"No hay preguntas para la categoría {categoria}")
            return
        self.quiz_screen.btn_next.text = "Responder"
        self.quiz_screen.btn_next.unbind(on_release=self.quiz_screen._volver_menu)
        self.quiz_screen.btn_next.bind(on_release=self.quiz_screen.on_responder)
        self.quiz_screen.cargar_categoria(categoria, preguntas)
        self.sm.current = "quiz"

if __name__ == "__main__":
    QuizziBrainKivyApp().run()
