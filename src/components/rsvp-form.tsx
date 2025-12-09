"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, Loader2 } from "lucide-react";

import { db } from "@/lib/firebase-config"; // Importa la instancia de Firestore
import { collection, addDoc } from "firebase/firestore"; // Funciones para guardar en Firestore

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const formSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "El nombre completo debe tener al menos 3 caracteres." }),
  email: z
    .string()
    .email({ message: "Por favor, introduce un correo electrónico válido." }),
  university: z
    .string()
    .min(2, { message: "El nombre de la universidad es requerido." }),
  career: z
    .string()
    .min(2, { message: "El nombre de la carrera es requerido." }),
  rut: z.string().regex(/^\d{7,8}-[\dkK]$/, {
    message: "Formato de RUT no válido. Debe ser 7 u 8 dígitos, seguido de guion y dígito verificador (Ej: 12345678-9 o 7654321-K)",
  }),
  confirmAttendance: z.boolean().refine((val) => val === true, {
    message: "Debes confirmar tu asistencia para poder registrarte.",
  }),
});

function SuccessMessage() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center animate-in fade-in-50 duration-500">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Check className="h-8 w-8 text-primary" />
      </div>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">
          ¡Inscripción Exitosa!
        </h2>
        <p className="text-muted-foreground">
          Hemos recibido tus datos. Recibirás un correo de confirmación pronto.
        </p>
      </div>
    </div>
  );
}

export function RsvpForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      university: "",
      career: "",
      rut: "",
      confirmAttendance: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // 1. Crea una referencia a la colección (similar a una tabla)
      const collectionRef = collection(db, 'invitaciones_scotiabank');

      // 2. Guarda los datos usando 'addDoc' para obtener un ID único
      await addDoc(collectionRef, {
        ...values,
        // Opcional: añade un timestamp
        fechaInscripcion: new Date().toISOString(),
      });

      console.log("Datos guardados con éxito en Firestore.");
      setIsSubmitted(true); // Muestra el mensaje de éxito

    } catch (error) {
      console.error("Error al guardar la inscripción en Firestore:", error);
      form.setError("root.serverError", {
        type: "400",
        message: "Hubo un error al enviar tu inscripción. Intenta de nuevo.",
      });
    }
  }

  return (
    <Card className="w-full transition-all duration-500">
      {isSubmitted ? (
        <SuccessMessage />
      ) : (
        <>
          <CardHeader>
            <CardTitle>Formulario de Inscripción</CardTitle>
            <CardDescription>
              Completa tus datos para reservar tu lugar en el evento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre y Apellidos</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: juan.perez@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Universidad</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Universidad de Chile"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="career"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carrera</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Ingeniería Comercial"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rut"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RUT</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 12345678-9" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmAttendance"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Confirmación de Asistencia</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === "true")}
                          // Mapeamos el valor booleano actual del campo a un string para RadioGroup
                          defaultValue={field.value ? "true" : "false"}
                          className="flex flex-col space-y-1"
                        >
                          {/* Opción SÍ */}
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="true" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Sí, participaré en el evento.
                            </FormLabel>
                          </FormItem>

                          {/* Opción NO */}
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="false" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              No participaré.
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Por favor, selecciona tu opción para confirmar tu participación.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Tu código de errores del servidor sigue aquí */}
                {form.formState.errors.root?.serverError && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.root.serverError.message}
                  </p>
                )}


                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Enviar Inscripción
                </Button>
              </form>
            </Form>
          </CardContent>
        </>
      )}
    </Card>
  );
}
