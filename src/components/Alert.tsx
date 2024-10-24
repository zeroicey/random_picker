interface Props {
  showAlert: Boolean;
  handleOutsideClick: (event: React.MouseEvent) => void;
}

export default function About({ showAlert, handleOutsideClick }: Props) {
  if (!showAlert) return null;
  else
    return (
      <div
        id="alert-overlay"
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        onClick={handleOutsideClick}
      >
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">No Names Found</h2>
          <p className="mb-2">Please import names from an Excel file.</p>
        </div>
      </div>
    );
}
