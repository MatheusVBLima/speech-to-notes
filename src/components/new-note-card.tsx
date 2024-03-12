import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ChangeEvent, FormEvent, useState } from "react";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

const SpeechRecognitionAPI =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const speechRecognition = new SpeechRecognitionAPI();

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [content, setContent] = useState("");

  function handleShouldShowOnboarding() {
    setShouldShowOnboarding(false);
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
    if (event.target.value === "") {
      setShouldShowOnboarding(true);
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();

    if (content === "") {
      return;
    }
    onNoteCreated(content);

    setContent("");

    setShouldShowOnboarding(true);

    toast.success("Nota criada com sucesso!");
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable =
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      toast.error(
        "Seu navegador não suporta a funcionalidade de reconhecimento de voz."
      );
      return;
    }

    setIsRecording(true);
    setShouldShowOnboarding(false);

    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcript = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setContent(transcript);
    };

    speechRecognition.onerror = (event) => {
      toast.error("Ocorreu um erro ao gravar a nota: " + event.error);
    };

    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition.stop();
    }
  }

  function handleOnOpenChangeDialog() {
    setShouldShowOnboarding(true);
    setIsRecording(false);
    setContent("");
  }

  return (
    <>
      <Card className="bg-primary text-secondary-foreground overflow-hidden">
        <CardHeader>
          <CardTitle>Adicionar Nota</CardTitle>
          <CardDescription className="text-secondary-foreground">
            Grave uma nota em áudio que será convertida em texto.
          </CardDescription>
        </CardHeader>
        <CardFooter className="h-full ">
          <Dialog onOpenChange={handleOnOpenChangeDialog}>
            <DialogTrigger className="flex w-full">
              <Button className="flex-1 mb-4" variant={"outline"}>
                Adicionar nova nota
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form>
                <DialogHeader>
                  <DialogTitle>Adicionar Nota</DialogTitle>
                  {shouldShowOnboarding ? (
                    <DialogDescription>
                      Comece{" "}
                      <Button
                        type="button"
                        variant={"link"}
                        className="p-0"
                        onClick={handleStartRecording}
                      >
                        gravando uma nota
                      </Button>{" "}
                      em áudio ou, se preferir,{" "}
                      <Button
                        type="button"
                        variant={"link"}
                        className="p-0"
                        onClick={handleShouldShowOnboarding}
                      >
                        utilize apenas texto
                      </Button>
                    </DialogDescription>
                  ) : (
                    <Textarea
                      className="resize-none md:text-base"
                      onChange={handleContentChanged}
                      value={content}
                      placeholder="Digite sua nota aqui..."
                    />
                  )}
                </DialogHeader>
                <DialogFooter className="mt-2">
                  {isRecording ? (
                    <Button
                      type="button"
                      variant="default"
                      onClick={handleStopRecording}
                      className="flex flex-1 items-center justify-center gap-2"
                    >
                      <div className="size-3 rounded-full bg-red-600 animate-pulse" />
                      Gravando! (clique para parar)
                    </Button>
                  ) : (
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="default"
                        disabled={shouldShowOnboarding}
                        onClick={handleSaveNote}
                        className="flex-1"
                      >
                        Salvar Nota
                      </Button>
                    </DialogClose>
                  )}
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </>
  );
}
