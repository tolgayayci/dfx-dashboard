export default function IdentitiesComponent() {
  const handleClick = async () => {
    try {
      // Here we call the exposed method from preload.js
      const result = await window.versions.runDfxCommand("info webserver-port");
      console.log(result); // log the result from main process
    } catch (error) {
      console.error(`Error: ${error}`); // log error
    }
  };

  return (
    <div>
      <h1>Identities</h1>
      <button
        className="bg-indigo-700 text-white px-2 py-1"
        onClick={handleClick}
      >
        Button
      </button>
    </div>
  );
}
