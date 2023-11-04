interface IloadingSavingBtn {
  isLoading: boolean;
  savingFunction: (e: any) => void;
  shallSendEvent: boolean;
  textOnBtn: any;
}

export const LoadingSavingBtn = ({
  isLoading,
  savingFunction,
  shallSendEvent,
  textOnBtn,
}: IloadingSavingBtn) => {
  return (
    <button
      type="submit"
      onClick={shallSendEvent ? (e) => savingFunction(e) : savingFunction}
      className={
        isLoading
          ? "btn btn-mg btn-secondary disabled"
          : "btn btn-mg btn-secondary"
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
