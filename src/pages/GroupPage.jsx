import { useParams } from "react-router-dom";

export default function GroupPage() {
  const { groupId } = useParams();
  return <div className="p-4">Group Chat ID: {groupId}</div>
}
