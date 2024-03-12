import {
  Card,
  CardContent,
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
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onNoteDeleted: (id: string) => void;
}

export function NoteCard({ note, onNoteDeleted }: NoteCardProps) {
  return (
    <Card className="hover:ring-2 hover:ring-primary flex flex-col">
      <CardHeader className="">
        <CardTitle>Notas</CardTitle>
        <CardDescription>
          {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 px-6">
        <p className="line-clamp-3">{note.content}</p>
      </CardContent>
      <CardFooter className="flex gap-2 w-full items-center justify-center">
        <div className="flex w-full ">
          <Dialog>
            <DialogTrigger className="flex-1">
              <Button className="w-full">Ver tudo</Button>
            </DialogTrigger>
            <DialogContent className="sm:w-full max-h-full overflow-auto">
              <DialogHeader>
                <DialogTitle>Nota Completa</DialogTitle>
                <DialogDescription>
                  Nota feita no dia {note.date.toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              <p className="text-justify ">{note.content}</p>
              <DialogFooter className="flex justify-center ">
                <DialogClose asChild>
                  <Button className="flex flex-1">Fechar</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Dialog>
          <DialogTrigger>
            <Button variant={"destructive"}>Apagar Nota</Button>
          </DialogTrigger>
          <DialogContent className="sm:w-1/2 md:w-1/4 ">
            <DialogHeader>
              <DialogTitle>Apagar nota</DialogTitle>
              <DialogDescription>
                Tem certeza que quer apagar essa nota?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center ">
              <DialogClose asChild>
                <Button
                  variant="destructive"
                  className="flex flex-1"
                  onClick={() => onNoteDeleted(note.id)}
                >
                  Apagar Nota
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
