export default function LoadingState() {
  return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="flex flex-col items-center text-white space-y-2">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>Carregando dados...</span>
      </div>
    </div>
  );
}
