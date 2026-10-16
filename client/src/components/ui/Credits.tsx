export default function Credits() {
  return (
    <footer className="px-4 py-6 text-center font-body text-xs leading-relaxed text-muted/70">
      Secret Hitler ©{" "}
      <a
        className="underline decoration-muted/40 underline-offset-2 hover:text-cream"
        href="https://www.secrethitler.com/"
      >
        Goat, Wolf &amp; Cabbage
      </a>
      . Arte adaptado para la web por{" "}
      <a
        className="underline decoration-muted/40 underline-offset-2 hover:text-cream"
        href="https://github.com/ShrimpCryptid/Secret-Hitler-Online"
      >
        ShrimpCryptid
      </a>{" "}
      (
      <a
        className="underline decoration-muted/40 underline-offset-2 hover:text-cream"
        href="https://secret-hitler.online/"
      >
        secret-hitler.online
      </a>
      ).{" "}
      <a
        className="underline decoration-muted/40 underline-offset-2 hover:text-cream"
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
      >
        CC BY-NC-SA 4.0
      </a>
      . Proyecto no comercial.
    </footer>
  );
}
