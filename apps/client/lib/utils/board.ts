import type {
  GetBoardsResponse,
  BoardItem,
} from "@repo/contracts/response/board";

type TeamBoard = Pick<BoardItem, "id" | "name">;

export type FormattedTeamBoards = {
  teamId: string;
  teamName: string;
  boards: TeamBoard[];
}[];

export function formatBoards(
  boards: GetBoardsResponse["data"],
): FormattedTeamBoards {
  const teams = new Map<string, FormattedTeamBoards[number]>();

  for (const board of boards) {
    const team = board.team;

    if (!team?.id) continue;

    let teamBoards = teams.get(team.id);

    if (!teamBoards) {
      teamBoards = {
        teamId: team.id,
        teamName: team.name,
        boards: [],
      };

      teams.set(team.id, teamBoards);
    }

    teamBoards.boards.push({
      id: board.id,
      name: board.name,
    });
  }

  return Array.from(teams.values());
}
