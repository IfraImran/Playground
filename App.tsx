import { useState } from "react";
import { Modal } from "./components/Modal";
import { Tabs, type TabItem } from "./components/Tabs";
import { Disclosure } from "./components/Disclosure";

const tabItems: TabItem[] = [
  { id: "account", label: "Account", panel: <p>Update your account details here.</p> },
  { id: "billing", label: "Billing", panel: <p>Manage your billing information here.</p> },
  { id: "notifications", label: "Notifications", panel: <p>Choose what you get notified about.</p> },
];

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <main className="playground">
      <h1>Accessible components playground</h1>

      <section>
        <h2>Modal</h2>
        <button type="button" onClick={() => setModalOpen(true)}>
          Open modal
        </button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          titleId="demo-modal-title"
          title="Confirm action"
        >
          <p>Are you sure you want to continue? This cannot be undone.</p>
        </Modal>
      </section>

      <section>
        <h2>Tabs</h2>
        <Tabs label="Settings" items={tabItems} />
      </section>

      <section>
        <h2>Disclosure</h2>
        <Disclosure summary="What data do you collect?">
          <p>We only collect what's needed to run the product, nothing more.</p>
        </Disclosure>
      </section>
    </main>
  );
}
