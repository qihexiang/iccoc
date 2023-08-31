import { useState } from "react";

export default function ClickInputSave(props: {
  container?: (value: string) => JSX.Element | string;
  initValue?: string;
  inputdiv?:
    | ((value: string, onChange: (value: string) => void) => JSX.Element)
    | string;
  clickBtn?: ((onClick: () => void) => JSX.Element) | string;
  saveBtn?: ((onClick: () => void) => JSX.Element) | string;
  cancelBtn?: ((onClick: () => void) => JSX.Element) | string;
  onSave: (value: string) => boolean | Promise<boolean>;
}) {
  const [inputValue, setInputValue] = useState<string | undefined>(undefined);
  const {
    container,
    initValue,
    inputdiv,
    clickBtn,
    saveBtn,
    cancelBtn,
    onSave,
  } = props;
  const containerComponent =
    container === undefined ? initValue ?? "" : container(initValue ?? "");

  const inputComponent =
    inputdiv === undefined || typeof inputdiv === "string" ? (
      <input
        type={"text"}
        placeholder={inputdiv ?? "Input here"}
        value={inputValue ?? ""}
        onChange={(e) => setInputValue(e.target.value)}
      ></input>
    ) : (
      inputdiv(inputValue ?? "", setInputValue)
    );
  const enterInputMode = () => setInputValue(initValue ?? "");
  const clickComponent =
    clickBtn === undefined || typeof clickBtn === "string" ? (
      <button onClick={enterInputMode}>{clickBtn ?? "Input"}</button>
    ) : (
      clickBtn(enterInputMode)
    );
  const saveContent = async () => {
    if (!(inputValue === undefined)) {
      const result = await onSave(inputValue);
      if (result) setInputValue(undefined);
    }
  };
  const saveComponent =
    saveBtn === undefined || typeof saveBtn === "string" ? (
      <button onClick={saveContent}>{saveBtn ?? "Save"}</button>
    ) : (
      saveBtn(saveContent)
    );
  const cancelInput = () => setInputValue(undefined);
  const cancelComponent =
    cancelBtn === undefined || typeof cancelBtn === "string" ? (
      <button onClick={cancelInput}>{cancelBtn ?? "Cancel"}</button>
    ) : (
      cancelBtn(cancelInput)
    );

  return inputValue !== undefined ? (
    <>
      {inputComponent}
      {saveComponent}
      {cancelComponent}
    </>
  ) : (
    <>
      {containerComponent}
      {clickComponent}
    </>
  );
}
