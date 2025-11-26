export function normalizeBike(raw = {}) {
  const id = raw.id ?? raw._id ?? raw.pk ?? null;
  const title = raw.title ?? raw.name ?? raw.title ?? 'Untitled Bike';
  const image = raw.image ?? raw.imageUrl ?? raw.image_url ?? null;
  const price_per_day = raw.price_per_day ?? raw.pricePerDay ?? raw.price ?? 0;
  const available = typeof raw.available === 'boolean' ? raw.available : (raw.is_available ?? true);
  const location = raw.location ?? raw.city ?? '';
  const description = raw.description ?? '';
  const owner = raw.owner ?? (raw.owner_id ? { id: raw.owner_id } : null);
  const created_at = raw.created_at ?? raw.createdAt ?? null;

  return {
    id,
    title,
    image,
    price_per_day,
    available,
    location,
    description,
    owner,
    created_at,
    raw,
  };
}
