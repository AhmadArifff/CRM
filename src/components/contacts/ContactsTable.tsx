'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Building,
  Mail,
  Phone,
  Tag,
  Filter,
  Sparkles,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { Contact, LeadStatus } from '../../types/crm';

interface ContactsTableProps {
  contacts: Contact[];
  onAddContact: (newContact: Omit<Contact, 'id' | 'createdAt' | 'notesCount'>) => void;
  salesReps: string[];
}

export const ContactsTable: React.FC<ContactsTableProps> = ({
  contacts,
  onAddContact,
  salesReps,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('Procurement Manager');
  const [status, setStatus] = useState<LeadStatus>('NEW');
  const [value, setValue] = useState(100000000);
  const [assignedTo, setAssignedTo] = useState(salesReps[0] || 'Budi Santoso');

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !companyName) return;

    onAddContact({
      name,
      email: email || 'lead@company.id',
      phone: phone || '+62 812 0000 0000',
      companyName,
      role,
      status,
      value: Number(value),
      assignedTo,
    });

    setName('');
    setEmail('');
    setPhone('');
    setCompanyName('');
    setIsAddModalOpen(false);
  };

  const getStatusBadge = (st: LeadStatus) => {
    switch (st) {
      case 'NEW':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'QUALIFIED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'CONTACTED':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'CUSTOMER':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'LOST':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    }
  };

  const handleExportCSV = () => {
    alert(`Berhasil mengunduh data ${filteredContacts.length} contacts ke format CSV!`);
  };

  return (
    <div className="space-y-5 pb-16 lg:pb-0">
      {/* Top Filter & Search */}
      <div className="glass-panel p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari lead, email, perusahaan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 text-xs text-gray-300 bg-slate-900/80 px-3 py-2 rounded-xl border border-white/10 shrink-0">
            <Filter className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="text-gray-400 shrink-0">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer w-full"
            >
              <option value="ALL" className="bg-slate-900">
                Semua Status ({contacts.length})
              </option>
              <option value="NEW" className="bg-slate-900">
                NEW
              </option>
              <option value="QUALIFIED" className="bg-slate-900">
                QUALIFIED
              </option>
              <option value="CONTACTED" className="bg-slate-900">
                CONTACTED
              </option>
              <option value="CUSTOMER" className="bg-slate-900">
                CUSTOMER
              </option>
              <option value="LOST" className="bg-slate-900">
                LOST
              </option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="touch-target flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold text-gray-300 hover:text-white rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Export CSV
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="touch-target flex-1 sm:flex-initial px-4 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Tambah Lead
          </button>
        </div>
      </div>

      {/* 1. MOBILE-FIRST LEAD CARDS VIEW (< 768px Handphone View) */}
      <div className="space-y-3 md:hidden">
        {filteredContacts.length === 0 ? (
          <div className="glass-panel p-8 text-center text-gray-500 rounded-2xl text-xs">
            Tidak ditemukan lead yang cocok.
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="p-4 rounded-2xl glass-panel glass-panel-hover border border-white/10 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-extrabold text-white text-sm">{contact.name}</h4>
                  <span className="text-xs text-gray-300 font-medium flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3 text-indigo-400" />
                    {contact.companyName} ({contact.role})
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                    contact.status
                  )}`}
                >
                  <Tag className="w-3 h-3" />
                  {contact.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                <span className="text-gray-400 text-[11px]">Potensi:</span>
                <span className="font-black text-emerald-400">
                  Rp {contact.value.toLocaleString('id-ID')}
                </span>
              </div>

              {/* Direct Tap Actions for Phone & Email */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                <a
                  href={`tel:${contact.phone}`}
                  className="touch-target flex-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-[11px] font-bold text-indigo-300 flex items-center justify-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5 text-purple-400" />
                  Hubungi
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="touch-target flex-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-[11px] font-bold text-gray-300 flex items-center justify-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  Email
                </a>
                <button
                  onClick={() => alert(`Catatan lead ${contact.name}`)}
                  className="touch-target p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold px-3"
                >
                  Catatan ({contact.notesCount})
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 2. TABLET & DESKTOP DATA TABLE (>= 768px Tablet/iPad/Desktop View) */}
      <div className="hidden md:block glass-panel rounded-2xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-xs font-bold text-gray-400 border-b border-white/10">
                <th className="py-3.5 px-5">Nama Lead & Contact</th>
                <th className="py-3.5 px-5">Perusahaan & Jabatan</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Potensi Transaksi</th>
                <th className="py-3.5 px-5">Assigned Rep</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    Tidak ditemukan data lead.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-white text-sm">{contact.name}</div>
                      <div className="flex items-center gap-3 text-gray-400 text-[11px] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-indigo-400" />
                          {contact.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-purple-400" />
                          {contact.phone}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-semibold text-gray-200 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        {contact.companyName}
                      </div>
                      <span className="text-[11px] text-gray-400 block">{contact.role}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(
                          contact.status
                        )}`}
                      >
                        <Tag className="w-3 h-3" />
                        {contact.status}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-extrabold text-emerald-400 text-xs">
                        Rp {contact.value.toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-600/40 border border-indigo-500/50 flex items-center justify-center font-bold text-[10px] text-indigo-300">
                          {contact.assignedTo.charAt(0)}
                        </div>
                        <span className="text-gray-300 font-medium">{contact.assignedTo}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => alert(`Memuka detail catatan untuk ${contact.name}`)}
                        className="touch-target px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold transition-all"
                      >
                        Catatan ({contact.notesCount})
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="glass-panel w-full max-w-lg p-5 sm:p-6 rounded-2xl space-y-4 border border-indigo-500/30 my-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Tambah Lead Baru
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="touch-target text-gray-400 hover:text-white font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-300">Nama Lengkap Contact</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Bambang Hermawan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Email Contact</label>
                  <input
                    type="email"
                    placeholder="bambang@perusahaan.co.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">No. Telepon / WA</label>
                  <input
                    type="text"
                    placeholder="+62 812 3456 7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Nama Perusahaan</label>
                  <input
                    type="text"
                    required
                    placeholder="PT Sarana Tekno"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Jabatan / Role</label>
                  <input
                    type="text"
                    placeholder="General Manager"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Status Initial</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as LeadStatus)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input bg-slate-900"
                  >
                    <option value="NEW">NEW</option>
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="CONTACTED">CONTACTED</option>
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="LOST">LOST</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-300">Assigned Sales Rep</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl glass-input bg-slate-900"
                  >
                    {salesReps.map((rep) => (
                      <option key={rep} value={rep}>
                        {rep}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="touch-target px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="touch-target px-5 py-2 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                >
                  Simpan Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
