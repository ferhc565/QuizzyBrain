import tkinter as tk
from tkinter import messagebox
import json
import os
from PIL import Image, ImageTk

APP_WIDTH = 1024
APP_HEIGHT = 600

CATEGORIES = [
    ("Geografía", "#2ECC71"),
    ("Historia", "#3498DB"),
    ("Computacion", "#E74C3C"),
    ("Enfermeria", "#2980B9"),
    ("Ingles", "#9B59B6"),
    ("Logica", "#1ABC9C"),
    ("Matematicas", "#F39C12"),
]

class QuizziBrainApp:
    def __init__(self, root):
        self.root = root
        self.root.title("QuizziBrain")
        self.root.geometry(f"{APP_WIDTH}x{APP_HEIGHT}")
        self.root.resizable(False, False)

        # Load assets
        self.bg_image = ImageTk.PhotoImage(Image.open(self.asset_path("background.png")).resize((APP_WIDTH, APP_HEIGHT)))
        self.header_image = ImageTk.PhotoImage(Image.open(self.asset_path("header.png")).resize((APP_WIDTH, 90)))

        # Canvas
        self.canvas = tk.Canvas(self.root, width=APP_WIDTH, height=APP_HEIGHT, highlightthickness=0, bd=0)
        self.canvas.pack(fill="both", expand=True)
        self.canvas.create_image(0, 0, image=self.bg_image, anchor="nw")
        self.canvas.create_image(0, 0, image=self.header_image, anchor="nw")

        # Subtitle
        self.canvas.create_text(
            APP_WIDTH//2, 130,
            text="Selecciona una categoría o administra tus preguntas",
            font=("Arial", 16),
            fill="#555555"
        )

        # Load questions
        self.preguntas = self.cargar_preguntas()

        # Create category buttons
        self.create_category_buttons()

        # Bottom buttons
        self.create_bottom_buttons()

    def asset_path(self, name):
        return os.path.join(os.path.dirname(__file__), name)

    def cargar_preguntas(self):
        try:
            with open(self.asset_path("preguntas.json"), "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            messagebox.showerror("Error", f"No se pudo cargar preguntas.json:\n{e}")
            return {}

    def create_category_buttons(self):
        start_y = 190
        col_x = [APP_WIDTH//2 - 260, APP_WIDTH//2 + 260]

        for idx, (nombre, color) in enumerate(CATEGORIES):
            row = idx // 2
            col = idx % 2
            x = col_x[col]
            y = start_y + row * 80

            btn = tk.Button(
                self.root,
                text=nombre,
                font=("Arial", 16, "bold"),
                bg=color,
                fg="white",
                activebackground=color,
                activeforeground="white",
                bd=0,
                relief="flat",
                cursor="hand2",
                command=lambda n=nombre: self.iniciar_quiz(n)
            )
            self.canvas.create_window(x, y, window=btn, anchor="center", width=380, height=55)

    def create_bottom_buttons(self):
        btn_conf = tk.Button(
            self.root,
            text="⚙ Configuración",
            font=("Arial", 12, "bold"),
            bg="#7F8C8D",
            fg="white",
            activebackground="#707B7C",
            activeforeground="white",
            bd=0,
            relief="flat",
            cursor="hand2",
            command=self.abrir_configuracion
        )
        self.canvas.create_window(APP_WIDTH//2 - 120, APP_HEIGHT - 50, window=btn_conf, anchor="center", width=180, height=35)

        btn_admin = tk.Button(
            self.root,
            text="🛠 Administrar preguntas",
            font=("Arial", 12, "bold"),
            bg="#16A085",
            fg="white",
            activebackground="#138D75",
            activeforeground="white",
            bd=0,
            relief="flat",
            cursor="hand2",
            command=self.administrar_preguntas
        )
        self.canvas.create_window(APP_WIDTH//2 + 120, APP_HEIGHT - 50, window=btn_admin, anchor="center", width=220, height=35)

    def iniciar_quiz(self, categoria):
        preguntas_categoria = self.preguntas.get(categoria)
        if not preguntas_categoria:
            messagebox.showinfo("Sin preguntas", f"No hay preguntas registradas para la categoría '{categoria}'.")
            return

        QuizWindow(self.root, categoria, preguntas_categoria)

    def abrir_configuracion(self):
        messagebox.showinfo("Configuración", "En futuras versiones podrás ajustar opciones de QuizziBrain aquí.")

    def administrar_preguntas(self):
        messagebox.showinfo("Administrar preguntas", "En futuras versiones podrás agregar/editar preguntas desde la interfaz.")

class QuizWindow:
    def __init__(self, master, categoria, preguntas):
        self.top = tk.Toplevel(master)
        self.top.title(f"QuizziBrain - {categoria}")
        self.top.geometry("800x500")
        self.top.resizable(False, False)

        self.categoria = categoria
        self.preguntas = preguntas
        self.indice = 0
        self.correctas = 0

        self.lbl_categoria = tk.Label(self.top, text=f"Categoría: {categoria}", font=("Arial", 16, "bold"))
        self.lbl_categoria.pack(pady=10)

        self.lbl_pregunta = tk.Label(self.top, text="", font=("Arial", 14), wraplength=760, justify="left")
        self.lbl_pregunta.pack(pady=20)

        self.var_opcion = tk.IntVar(value=-1)
        self.botones_opciones = []
        for i in range(4):
            rb = tk.Radiobutton(
                self.top,
                text="",
                variable=self.var_opcion,
                value=i,
                font=("Arial", 12),
                anchor="w",
                justify="left"
            )
            rb.pack(fill="x", padx=40, pady=5)
            self.botones_opciones.append(rb)

        self.btn_siguiente = tk.Button(self.top, text="Responder", font=("Arial", 12, "bold"), command=self.responder)
        self.btn_siguiente.pack(pady=20)

        self.lbl_progreso = tk.Label(self.top, text="", font=("Arial", 11))
        self.lbl_progreso.pack(pady=5)

        self.mostrar_pregunta()

    def mostrar_pregunta(self):
        if self.indice >= len(self.preguntas):
            self.finalizar_quiz()
            return

        preg = self.preguntas[self.indice]
        self.lbl_pregunta.config(text=preg["pregunta"])
        opciones = preg["opciones"]
        for i, rb in enumerate(self.botones_opciones):
            if i < len(opciones):
                rb.config(text=opciones[i], state="normal")
            else:
                rb.config(text="", state="disabled")

        self.var_opcion.set(-1)
        self.lbl_progreso.config(text=f"Pregunta {self.indice + 1} de {len(self.preguntas)}")

    def responder(self):
        seleccion = self.var_opcion.get()
        if seleccion == -1:
            messagebox.showwarning("Sin respuesta", "Selecciona una opción antes de continuar.")
            return

        correcta = self.preguntas[self.indice]["respuesta"]
        if seleccion == correcta:
            self.correctas += 1

        self.indice += 1
        if self.indice < len(self.preguntas):
            self.mostrar_pregunta()
        else:
            self.finalizar_quiz()

    def finalizar_quiz(self):
        total = len(self.preguntas)
        messagebox.showinfo("Resultado", f"Respuestas correctas: {self.correctas} de {total}")
        self.top.destroy()

def mostrar_splash():
    splash_root = tk.Tk()
    splash_root.overrideredirect(True)
    splash_root.geometry(f"{APP_WIDTH}x{APP_HEIGHT}+100+50")

    img = ImageTk.PhotoImage(Image.open(os.path.join(os.path.dirname(__file__), "splash.png")).resize((APP_WIDTH, APP_HEIGHT)))
    label = tk.Label(splash_root, image=img)
    label.image = img
    label.pack()

    def launch_main():
        splash_root.destroy()
        root = tk.Tk()
        app = QuizziBrainApp(root)
        root.mainloop()

    splash_root.after(2200, launch_main)
    splash_root.mainloop()

if __name__ == "__main__":
    mostrar_splash()
