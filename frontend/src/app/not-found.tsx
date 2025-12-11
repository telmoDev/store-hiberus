"use client";

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold">404 - Página no encontrada</h2>
                <p className="text-muted-foreground mt-2">
                    La página que estás buscando no existe.
                </p>
                <a href="/" className="mt-4 inline-block text-primary hover:underline">
                    Regresar a la página principal
                </a>
            </div>
        </div>
    );
}
