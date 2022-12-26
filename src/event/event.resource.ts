export class EventResource {
  constructor() {}

  transformHomeEvent(res: any) {
    let transformed = {
      ...res,
      event_date: res.itinenaries.length > 0 ? res.itinenaries[0].day : "-",
      event_time:
        res.itinenaries.length > 0 && res.itinenaries[0].activity.length > 0
          ? res.itinenaries[0].activity[0].start_time
          : "-",
    };
    delete transformed.itinenaries;

    return transformed;
  }

  transformOneEvent(res: any) {
    let transformed = {
      ...res,
      organizer: {
        id: res.user.id,
        username: res.user.username,
      },
      wishlist_users: res.wishlists.map((w) => w.user_id),
      participants: res.participants,
      transactions: res.transactions,
      sponsor_logos: res.sponsors.map((sp) => sp.brand_logo),
      event_date: res.itinenaries.length > 0 ? res.itinenaries[0].day : "-",
      itinenaries: res.itinenaries,
      event_time:
        res.itinenaries.length > 0 && res.itinenaries[0].activity.length > 0
          ? res.itinenaries[0].activity[0].start_time
          : "-",
    };
    delete transformed.wishlist;
    delete transformed.user;
    delete transformed.sponsor;

    return transformed;
  }

  transformManagedEvent(res: any) {
    let transformed = {
      ...res,
      organizer: {
        id: res.user.id,
        username: res.user.username,
      },
      total_participant: res.participants.length,
      total_revenue: res.transactions.map((t: any) => t.total).reduce((total, curr) => total + curr, 0),
      event_date: res.itinenaries.length > 0 ? res.itinenaries[0].day : "-",
      event_time:
        res.itinenaries.length > 0 && res.itinenaries[0].activity.length > 0
          ? res.itinenaries[0].activity[0].start_time
          : "-",
    };
    delete transformed.itinenaries;
    delete transformed.participants;
    delete transformed.transactions;
    delete transformed.user;

    return transformed;
  }
}
