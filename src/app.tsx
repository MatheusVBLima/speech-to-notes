import { ChangeEvent, useState } from "react";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";
import { Input } from "./components/ui/input";
import { Separator } from "./components/ui/separator";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }

    return [];
  });

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const notesArray = [newNote, ...notes];

    setNotes(notesArray);

    localStorage.setItem("notes", JSON.stringify(notesArray));
  }

  function onNoteDeleted(id: string) {
    const newNotes = notes.filter((note) => note.id !== id);

    setNotes(newNotes);

    localStorage.setItem("notes", JSON.stringify(newNotes));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  function handleDeleteAllNotes() {
    setNotes([]);
    localStorage.removeItem("notes");
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLowerCase().includes(search.toLowerCase())
        )
      : notes;

  return (
    <div className="max-w-6xl mx-auto my-12 space-y-6 px-2 md:px-0">
      <h1 className="font-anta font-bold text-2xl text-balance text-center sm:text-4xl">
        Byte by Byte till{" "}
        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Alexandria
        </span>{" "}
      </h1>
      <p className="font-anta font-bold text-lg text-balance text-center sm:text-2xl">
        Voice Notes
      </p>
      <Separator />
      <form className="flex items-center justify-center flex-col gap-6 md:flex-row">
        <Input
          type="text"
          placeholder="Busque em suas notas..."
          className="px-2 py-4 w-full bg-transparent text-lg md:text-2xl font-semibold tracking-tight"
          onChange={handleSearch}
        />
        <Separator className="md:hidden" />
        <Dialog>
          <DialogTrigger>
            <Button variant={"destructive"} type="button">
              Apagar todas as notas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:w-1/4">
            <DialogHeader>
              <DialogTitle>Apagar todas as nota</DialogTitle>
              <DialogDescription>
                Tem certeza que quer apagar todas as notas?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center ">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className="flex flex-1"
                  onClick={handleDeleteAllNotes}
                >
                  APAGAR TODAS AS NOTAS
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
      <Separator />
      <div className="grid gap-6 px-2 grid-cols-1 auto-rows-[15.625rem] md:grid-cols-2 lg:grid-cols-3 ">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map((note) => {
          return (
            <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
          );
        })}
      </div>
    </div>
  );
}
