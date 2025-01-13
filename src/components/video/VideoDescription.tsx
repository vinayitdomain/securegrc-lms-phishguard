interface VideoDescriptionProps {
  description: string | null;
}

export const VideoDescription = ({ description }: VideoDescriptionProps) => {
  if (!description) return null;
  
  return (
    <div className="prose max-w-none mt-6">
      <h2 className="text-xl font-semibold mb-2">Description</h2>
      <p>{description}</p>
    </div>
  );
};