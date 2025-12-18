import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../../components/Spinner";

export default function AddTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    from: "",
    to: "",
    transportType: "",
    price: "",
    ticketQuantity: "",
    departure: "",
    image: "",
    perks: ["", "", "", "", "", "", ""], // ✅ 7 perks
  });

  useEffect(() => {
    if (isEdit) {
      axiosSecure.get(`/tickets/vendor/${id}`).then(res => {
        const t = res.data;
        setForm({
          ...t,
          perks: t.perks?.length ? t.perks : ["", "", "", "", "", "", ""],
          departure: t.departure?.slice(0, 16),
        });
      });
    }
  }, [id]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePerkChange = (i, value) => {
    const perks = [...form.perks];
    perks[i] = value;
    setForm({ ...form, perks });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      perks: form.perks.filter(p => p.trim() !== ""),
    };

    try {
      if (isEdit) {
        await axiosSecure.patch(`/tickets/${id}`, payload);
      } else {
        await axiosSecure.post("/tickets", payload);
      }
      navigate("/dashboard/vendor/my-tickets");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {isEdit ? "Update Ticket" : "Add Ticket"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="title" required value={form.title} onChange={handleChange} className="input w-full" placeholder="Title" />
        <input name="from" required value={form.from} onChange={handleChange} className="input w-full" placeholder="From" />
        <input name="to" required value={form.to} onChange={handleChange} className="input w-full" placeholder="To" />
        <input name="transportType" required value={form.transportType} onChange={handleChange} className="input w-full" placeholder="Transport Type" />
        <input type="number" name="price" required value={form.price} onChange={handleChange} className="input w-full" />
        <input type="number" name="ticketQuantity" required value={form.ticketQuantity} onChange={handleChange} className="input w-full" />
        <input type="datetime-local" name="departure" required value={form.departure} onChange={handleChange} className="input w-full" />
        <input name="image" value={form.image} onChange={handleChange} className="input w-full" placeholder="Image URL" />

        <div>
          <p className="font-semibold">7 Perks</p>
          {form.perks.map((perk, i) => (
            <input
              key={i}
              value={perk}
              onChange={e => handlePerkChange(i, e.target.value)}
              className="input w-full mt-1"
              placeholder={`Perk ${i + 1}`}
            />
          ))}
        </div>

        <button className="btn btn-primary w-full">
          {isEdit ? "Update Ticket" : "Add Ticket"}
        </button>
      </form>
    </div>
  );
}