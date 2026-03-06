import { getSortingStateParser } from "@/lib/parser";
import type {
  MessagesSearchParams,
  MessageTableData,
} from "@/types/message-types";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export default function useGetMessagesSearchParams(): MessagesSearchParams {
  const [params, _] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
    sort: getSortingStateParser<MessageTableData>().withDefault([
      { id: "createdAt", desc: true },
    ]),
    name: parseAsString.withDefault(""),
    email: parseAsString.withDefault(""),
    source: parseAsString.withDefault(""),
  });

  return params;
}
