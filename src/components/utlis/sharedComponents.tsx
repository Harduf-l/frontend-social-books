export enum btnOptions {
  "light" = "btn-light",
  "secondary" = "btn-secondary",
}

interface IloadingSavingBtn {
  isLoading: boolean;
  savingFunction: (e: any) => void;
  shallSendEvent?: boolean;
  textOnBtn: any;
  btnStyle?: btnOptions;
}

export const LoadingSavingBtn = ({
  isLoading,
  savingFunction,
  shallSendEvent,
  textOnBtn,
  btnStyle = btnOptions.secondary,
}: IloadingSavingBtn) => {
  return (
    <button
      type="submit"
      onClick={shallSendEvent ? (e) => savingFunction(e) : savingFunction}
      className={
        isLoading ? `btn btn-mg disabled ${btnStyle}` : `btn btn-mg ${btnStyle}`
      }
    >
      {isLoading && (
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
          style={{ marginInlineEnd: 10 }}
        ></span>
      )}
      {textOnBtn}
    </button>
  );
};
