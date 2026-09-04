"use client";

import { useState, useEffect, useCallback } from "react";

interface AccountField {
  label: string;
  placeholder: string;
  type: string;
}

interface Nominal {
  value: number;
  label: string;
  tag?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
}

interface OrderFormProps {
  gameId: string;
  gameName: string;
  accountFields: AccountField[];
  nominals: Nominal[];
  paymentMethods?: PaymentMethod[];
  onNominalChange?: (label: string, value: number) => void;
  onPaymentChange?: (value: string) => void;
  onSubmitRef?: React.MutableRefObject<(() => void) | null>;
  onFormMsgChange?: (msg: string | null) => void;
  onSubmittingChange?: (submitting: boolean) => void;
  onSuccess?: (invoice: string) => void;
}

export default function OrderForm({
  gameName,
  accountFields,
  nominals,
  paymentMethods,
  onNominalChange,
  onPaymentChange,
  onSubmitRef,
  onFormMsgChange,
  onSubmittingChange,
  onSuccess,
}: OrderFormProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>(paymentMethods || []);
  const [selectedNominal, setSelectedNominal] = useState<string>(
    nominals[0]?.value.toString() || ""
  );
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [formMsg, setFormMsg] = useState<string>("");
  const [formMsgVisible, setFormMsgVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (paymentMethods && paymentMethods.length > 0) return;

    fetch("/api/payment-methods")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.length > 0) {
          setMethods(data);
          setSelectedPayment(data[0].name);
        }
      })
      .catch(() => {});
  }, [paymentMethods]);

  const handleNominalChange = (label: string, value: number) => {
    setSelectedNominal(value.toString());
    onNominalChange?.(label, value);
  };

  const handlePaymentChange = (value: string) => {
    setSelectedPayment(value);
    onPaymentChange?.(value);
  };

  const showMsg = useCallback(
    (msg: string | null) => {
      if (msg) {
        setFormMsgVisible(true);
        setFormMsg(msg);
      } else {
        setFormMsgVisible(false);
        setFormMsg("");
      }
      onFormMsgChange?.(msg);
    },
    [onFormMsgChange]
  );

  const handleSubmit = useCallback(async () => {
    const form = document.getElementById("orderForm") as HTMLFormElement;
    const textInputs = form?.querySelectorAll('input[type="text"], input[type="tel"]');
    let ok = true;
    let accountId = "";
    let accountZone = "";
    let phone = "";

    textInputs?.forEach((input) => {
      const val = (input as HTMLInputElement).value.trim();
      const name = (input as HTMLInputElement).name;
      if (!val) {
        ok = false;
        (input as HTMLInputElement).style.borderColor = "#ff6b6b";
      } else {
        (input as HTMLInputElement).style.borderColor = "";
        if (name === "account_id") accountId = val;
        if (name === "account_zone") accountZone = val;
        if (name === "phone") phone = val;
      }
    });

    if (!ok) {
      showMsg("Lengkapi dulu data akun game kamu di langkah 1.");
      return;
    }

    if (!selectedNominal) {
      showMsg("Pilih nominal terlebih dahulu.");
      return;
    }

    if (!selectedPayment) {
      showMsg("Pilih metode pembayaran.");
      return;
    }

    setSubmitting(true);
    onSubmittingChange?.(true);

    try {
      const selected = nominals.find((n) => n.value.toString() === selectedNominal);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          game_name: gameName,
          item_name: selected?.label || "",
          account_id: accountId,
          account_zone: accountZone,
          payment_method: selectedPayment,
          customer_phone: phone,
          total_price: parseInt(selectedNominal),
          notes: "",
        }),
      });

      const data = await res.json();

      if (res.ok && data.invoice) {
        onSuccess?.(data.invoice);
      } else {
        showMsg(`Gagal membuat pesanan. ${data.error || "Coba lagi."}`);
      }
    } catch {
      showMsg("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSubmitting(false);
      onSubmittingChange?.(false);
    }
  }, [gameName, nominals, selectedNominal, selectedPayment, showMsg, onSubmittingChange]);

  useEffect(() => {
    if (onSubmitRef) {
      onSubmitRef.current = submitting ? null : handleSubmit;
    }
  }, [onSubmitRef, handleSubmit, submitting]);

  return (
    <form id="orderForm" className="space-y-5">
      {/* Step 1: Data Akun */}
      <section className="card rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="step-num">1</span>
          <h2 className="text-base font-bold">Masukkan Data Akun</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {accountFields.map((field) => (
            <label key={field.label} className="block">
              <span className="mb-1.5 block text-xs font-semibold text-white/70">
                {field.label}
              </span>
              <input
                type={field.type}
                inputMode="numeric"
                required
                className="fld"
                name={field.label.toLowerCase().includes("zone") ? "account_zone" : "account_id"}
                placeholder={field.placeholder}
              />
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-[color:var(--muted)]">
          {accountFields.length > 1
            ? `${accountFields[0].label} dan ${accountFields[1].label} ada di menu profil dalam game.`
            : `${accountFields[0].label} bisa dilihat di halaman profil ${gameName}.`}
        </p>
      </section>

      {/* Step 2: Pilih Nominal */}
      <section className="card rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="step-num">2</span>
          <h2 className="text-base font-bold">Pilih Nominal</h2>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-3.5 lg:grid-cols-4">
          {nominals.map((nominal) => (
            <label key={nominal.value} className="opt" tabIndex={0}>
              <input
                type="radio"
                name="nominal"
                value={nominal.value}
                checked={selectedNominal === nominal.value.toString()}
                onChange={() =>
                  handleNominalChange(nominal.label, nominal.value)
                }
              />
              <div className="opt-box">
                {nominal.tag ? (
                  <span className="opt-tag">{nominal.tag}</span>
                ) : (
                  <span className="opt-tag-placeholder" />
                )}
                <p className="text-[13px] font-bold leading-tight text-white">
                  {nominal.label}
                </p>
                <p className="mt-auto pt-1.5 text-[13px] font-bold text-[color:var(--em)]">
                  Rp{" "}
                  {nominal.value.toLocaleString("id-ID")}
                </p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Step 3: Pilih Pembayaran */}
      <section className="card rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="step-num">3</span>
          <h2 className="text-base font-bold">Pilih Pembayaran</h2>
        </div>
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {methods.map((method) => (
            <label key={method.id || method.name} className="opt">
              <input
                type="radio"
                name="bayar"
                value={method.name}
                checked={selectedPayment === method.name}
                onChange={() => handlePaymentChange(method.name)}
              />
              <div className="opt-box flex items-center justify-between gap-2">
                <div>
                  <p className="text-[13px] font-semibold text-white">
                    {method.name}
                  </p>
                  <p className="text-[11px] text-[color:var(--muted)]">
                    {method.description}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Step 4: Kontak Konfirmasi */}
      <section className="card rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="step-num">4</span>
          <h2 className="text-base font-bold">Kontak Konfirmasi</h2>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-white/70">
              Nomor WhatsApp
            </span>
            <input type="tel" className="fld" name="phone" placeholder="08xxxxxxxxxx" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-white/70">
              Email (opsional)
            </span>
            <input
              type="email"
              className="fld"
              name="email"
              placeholder="nama@email.com"
            />
          </label>
        </div>
        <p className="mt-3 text-xs text-[color:var(--muted)]">
          Bukti pesanan dan ID transaksi dikirim ke kontak ini. Kami tidak
          mengirim promosi tanpa izin.
        </p>
      </section>

      {formMsgVisible && (
        <p className="mt-3 rounded-lg border border-[color:var(--em)]/35 bg-[color:var(--em)]/10 px-3 py-2 text-xs text-white/85">
          {formMsg}
        </p>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-[color:var(--muted)]">
        Pastikan ID akun sudah benar. Item yang sudah dikirim ke ID yang salah
        tidak dapat ditarik kembali.
      </p>
    </form>
  );
}
