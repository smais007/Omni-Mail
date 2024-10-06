import axios from "axios";
import {
  type EmailMessage,
  type SyncUpdatedResponse,
  type SyncResponse,
} from "./types";

export class Account {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async startSync() {
    const response = await axios.post<SyncResponse>(
      "https://api.aurinko.io/v1/email/sync",
      {},
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          daysWhithin: 2,
          bodyType: "html",
        },
      },
    );

    console.log("Sync response data:", response.data);

    return response.data;
  }

  async getUpdatedEmails({
    deltaToken,
    pageToken,
  }: {
    deltaToken?: string;
    pageToken?: string;
  }): Promise<SyncUpdatedResponse> {
    let params: Record<string, string> = {};

    if (deltaToken) params.deltaToken = deltaToken;
    if (pageToken) params.pageToken = pageToken;

    const response = await axios.get<SyncUpdatedResponse>(
      "https:/api.aurinko.io/v1/email/sync/updated",
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params,
      },
    );

    return response.data; // Add this line
  }

  async performInitialSync() {
    try {
      let syncResponse = await this.startSync();

      while (!syncResponse.ready) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        syncResponse = await this.startSync();
      }

      let storeDeltaToken: string = syncResponse.syncUpdatedToken;

      let updatedResponse = await this.getUpdatedEmails({
        deltaToken: storeDeltaToken,
      });

      if (updatedResponse.nextDeltaToken) {
        storeDeltaToken = updatedResponse.nextDeltaToken;
      }

      let allEmails: EmailMessage[] = updatedResponse.records;

      while (updatedResponse.nextDeltaToken) {
        updatedResponse = await this.getUpdatedEmails({
          pageToken: updatedResponse.nextPageToken,
        });

        allEmails = allEmails.concat(updatedResponse.records);

        if (updatedResponse.nextDeltaToken) {
          storeDeltaToken = updatedResponse.nextDeltaToken;
        }
      }

      console.log(
        "initial sync done, we have synced",
        allEmails.length,
        "emails",
      );

      return {
        emails: allEmails,
        deltaToken: storeDeltaToken,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching Aurinko token:", error.response?.data);
        throw new Error("Failed to perform initial sync due to an API error.");
      } else {
        console.error("Unexpected error during sync:", error);
        throw new Error(
          "Failed to perform initial sync due to an unexpected error.",
        );
      }
    }
  }
}
