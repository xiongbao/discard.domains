import * as Dialog from "@radix-ui/react-dialog";
import Link from "@/components/Link";
import Button from "@/components/Button";
import Arrow from "@/components/Arrow";
import React from "react";
import { useRouter } from "next/router";

const Field = ({ label, name, type, placeholder, textArea, id, ...props }) => {
  const Component = textArea ? "textarea" : "input";
  return (
    <div className="flex flex-col gap-y-1">
      <label className="text-sm leading-none" htmlFor={id}>
        {label}
      </label>
      <Component
        className="p-2 text-sm leading-none border rounded-sm border-mcqueen placeholder:text-mcqueen/50"
        placeholder={placeholder}
        id={id}
        name={id}
        type={type}
        {...props}
      />
    </div>
  );
};

export default function Header() {
  const route = useRouter().route;
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const handleParam = () => (e) => {
    e.persist();
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const [inputs, setInputs] = React.useState({
    domainName: "",
    authCode: "",
    domainDescription: "",
    userName: "",
    userUrl: "",
    userEmail: "",
  });

  const formSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData();
    Object.entries(inputs).forEach(([key, value]) => {
      formData.append(key, value);
    });
    fetch(`https://getform.io/f/${process.env.DISCARD_FORM_ID}`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    }).then(() => {
      setSubmitted(true);
    });
  };

  return (
    <header className="justify-between w-full px-4 pt-12 pb-16 mx-auto sm:flex max-w-screen-2xl">
      <div>
        <h1 className="text-5xl">
          <Link href="/">Discard Domains</Link>
        </h1>
        <p className="max-w-md mt-1">
          Share your that are about to expire, not worth renewing domains,
          so that they can be acquired by those who need them for free.
        </p>
        {route === "/" ? (
          <Link href="/about" className="flex items-center mt-4 gap-x-1 w-fit">
            About <Arrow />
          </Link>
        ) : (
          <Link href="/" className="flex items-center mt-4 gap-x-1 w-fit">
            <Arrow className="rotate-180" />
            Home
          </Link>
        )}
      </div>
      <div className="flex items-start mt-4 sm:mt-0 gap-x-2">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button>Discard One</Button>
          </Dialog.Trigger>
          <Dialog.Overlay className="fixed inset-0 z-10 bg-mcqueen/25 backdrop-brightness-90" />
          <Dialog.Content className="fixed inset-0 z-20 w-full max-w-md px-4 py-6 mx-auto mt-48 bg-white border-2 h-fit border-mcqueen">
            <Dialog.Close className="absolute z-50 p-4 text-6xl cursor-pointer -top-2 right-1 isolate">
              ̽
            </Dialog.Close>
            <form
              className="flex flex-col gap-y-4"
              method="POST"
              onSubmit={formSubmit}
            >
              <h2 className="text-xl leading-none">Discard One</h2>
              <div className="grid grid-cols-2 gap-x-2">
                <Field
                  label="Domain name"
                  placeholder=""
                  id="domainName"
                  onChange={handleParam()}
                  value={inputs.domainName}
                />
                <Field
                  label="Authorization Code"
                  placeholder="FUWPGvbtNkEtK!k6"
                  id="authCode"
                  onChange={handleParam()}
                  value={inputs.authCode}
                />
              </div>
              <div>
                <Field
                  label="Describe why this domain name was discarded"
                  placeholder="韭菜，续费贵，垃圾米"
                  textArea
                  rows={5}
                  id="domainDescription"
                  onChange={handleParam()}
                  value={inputs.domainDescription}
                />
              </div>
              <hr className="border-mcqueen/25" />
              <h2 className="text-xl leading-none ">About Your</h2>
              <Field
                label="Your name"
                placeholder="韭菜"
                id="userName"
                onChange={handleParam()}
                value={inputs.userName}
              />
              <div className="grid grid-cols-2 gap-x-2">
                <Field
                  label="Url(Optional)"
                  placeholder="https://"
                  id="userUrl"
                  onChange={handleParam()}
                  value={inputs.userUrl}
                />
                <Field
                  label="Email"
                  placeholder="a@discard.domains"
                  type="email"
                  id="userEmail"
                  onChange={handleParam()}
                  value={inputs.userEmail}
                />
              </div>
              <Button
                type="submit"
                className="p-2 text-white rounded-sm bg-mcqueen disabled:bg-black"
                disabled={submitted || submitting}
              >
                Submit
              </Button>
              {submitted && (
                <>
                  <p>{"Received! I'll add to it the list soon."}</p>
                </>
              )}
            </form>
          </Dialog.Content>
        </Dialog.Root>
        {/* <Button>Share feedback</Button> */}
      </div>
    </header>
  );
}
