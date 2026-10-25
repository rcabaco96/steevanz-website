"use client";

import Link from "next/link";
import { useEffect } from "react";
import { oQuintal } from "@/content/o-quintal/facts";
import { oQuintalHref, type OQuintalMode } from "@/content/o-quintal/routes";
import { oQuintalCart } from "./cart-store";
import { ArrowIcon, MailIcon, PhoneIcon } from "./icons";
import { Leaf } from "./Logo";

// After Stripe: «sucesso» empties the cart (the payment went through on Stripe's page); «cancelada» keeps it.
export function OrderResult({ mode, kind }: { mode: OQuintalMode; kind: "success" | "cancel" }) {
  useEffect(() => {
    if (kind === "success") oQuintalCart.clear();
  }, [kind]);

  const success = kind === "success";
  return (
    <div className="px-4 pt-28 pb-24 sm:px-8 sm:pt-36">
      <div className="mx-auto max-w-[40rem] text-center">
        <Leaf className={`mx-auto h-14 w-14 ${success ? "text-folha" : "text-caixote"}`} />
        <h1 className="mt-6 font-display text-[clamp(2.2rem,8vw,3.6rem)] leading-[1.05] text-ardosia">
          {success ? "Obrigado pela sua encomenda!" : "O pagamento não foi concluído."}
        </h1>
        <p className="mt-4 text-lg text-terra">
          {success
            ? "Recebemos o pagamento. A O Quintal vai contactá-lo para combinar a entrega ou o levantamento. A Stripe envia-lhe o recibo por email."
            : "Não foi cobrado nada. O seu carrinho continua guardado, pode tentar novamente quando quiser."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={oQuintalHref(mode, success ? { kind: "shop", category: null } : { kind: "cart" })}
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-folha px-6 font-semibold text-giz"
          >
            {success ? "Voltar à loja" : "Voltar ao carrinho"} <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-ardosia">
          <a href={oQuintal.phoneHref} className="inline-flex min-h-11 items-center gap-2 font-semibold">
            <PhoneIcon className="h-4 w-4" /> {oQuintal.phoneDisplay}
          </a>
          <a href={`mailto:${oQuintal.email}`} className="inline-flex min-h-11 items-center gap-2 font-semibold">
            <MailIcon className="h-4 w-4" /> {oQuintal.email}
          </a>
        </div>
        <p className="text-xs text-terra">{oQuintal.phoneNote}</p>
      </div>
    </div>
  );
}
