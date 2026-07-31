'use client';

import { useRef, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { move } from "@dnd-kit/helpers";
import {
  AtSignIcon,
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  MailIcon,
  Maximize2Icon,
  MessageSquareIcon,
  SearchIcon,
  StrikethroughIcon,
} from "lucide-react";
import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { TimeInput } from "@/components/ui/TimeInput";
import { DateInput } from "@/components/ui/DateInput";
import { Text } from "@/components/ui/Text";
import { Box } from "@/components/ui/Box";
import { FormField } from "@/components/ui/FormField";
import { OTPInput } from "@/components/ui/OTPInput";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";
import { Select } from "@/components/ui/Select";
import { Separator } from "@/components/ui/Separator";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { Modal } from "@/components/ui/Modal";
import { ValidateActionDialog } from "@/components/dialogs/ValidateActionDialog";
import { Tabs } from "@/components/ui/Tabs";
import { Toast, useToast } from "@/components/ui/Toast";
import {
  Skeleton,
  createSkeletonComponent,
} from "@/components/ui/Skeleton";
import { Draggable } from "@/components/ui/Draggable";
import { Card } from "@/components/ui/Card";
import {
  Calendar,
  type CalendarRange,
} from "@/components/ui/Calendar";
import { Toolbar } from "@/components/ui/Toolbar";

const ProfileCardSkeleton = createSkeletonComponent<{ lines?: number }>(
  function ProfileCardSkeleton({ lines = 2 }) {
    return (
      <Box direction="column" gap={12} style={{ width: 280 }}>
        <Box gap={12} align="center">
          <Skeleton circle width={48} height={48} />
          <Box direction="column" gap={8} style={{ flex: 1, minWidth: 0 }}>
            {Array.from({ length: lines }, (_, index) => (
              <Skeleton
                key={index}
                height={12}
                width={index === 0 ? "70%" : "45%"}
              />
            ))}
          </Box>
        </Box>
        <Skeleton height={72} radius={12} />
      </Box>
    );
  },
);

function SkeletonShowcase() {
  const [loading, setLoading] = useState(true);

  return (
    <Box direction="column" gap={16}>
      <Box gap={8} wrap>
        <Skeleton width={120} height={16} />
        <Skeleton width={80} height={16} rounded />
        <Skeleton circle width={32} height={32} />
        <Skeleton width={200} height={48} radius={12} />
      </Box>
      <Box gap={8} align="center">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setLoading((current) => !current)}
        >
          loading = {String(loading)}
        </Button>
      </Box>
      <ProfileCardSkeleton loading={loading} lines={2}>
        <Box direction="column" gap={12} style={{ width: 280 }}>
          <Box gap={12} align="center">
            <Avatar name="Jane Doe" size="lg" />
            <Box direction="column" gap={4}>
              <Text.Body>Jane Doe</Text.Body>
              <Text.Caption>Product designer</Text.Caption>
            </Box>
          </Box>
          <Text.BodySmall>
            Contenu réel affiché quand loading est à false.
          </Text.BodySmall>
        </Box>
      </ProfileCardSkeleton>
    </Box>
  );
}

type BoardItems = Record<string, string[]>;

const COLUMN_LABELS: Record<string, string> = {
  todo: "À faire",
  doing: "En cours",
  done: "Terminé",
};

function DraggableShowcase() {
  const [items, setItems] = useState<BoardItems>({
    todo: ["Brief client", "Moodboard", "Wireframes"],
    doing: ["Prototype UI", "Revue design"],
    done: ["Kick-off"],
  });
  const [tags, setTags] = useState(["Brand", "UX", "Dev", "QA"]);
  const previousItems = useRef(items);
  const previousTags = useRef(tags);

  return (
    <Box direction="column" gap={24}>
      <Box direction="column" gap={8}>
        <Text.BodySmall>Kanban (listes verticales)</Text.BodySmall>
        <Draggable
          onDragStart={() => {
            previousItems.current = structuredClone(items);
          }}
          onDragOver={(event) => {
            setItems((current) => move(current, event));
          }}
          onDragEnd={(event) => {
            if (event.canceled) {
              setItems(previousItems.current);
            }
          }}
        >
          <Box gap={16} align="stretch" style={{ overflowX: "auto" }}>
            {Object.keys(items).map((columnId) => (
              <Box
                key={columnId}
                direction="column"
                gap={12}
                padding={12}
                style={{
                  width: 220,
                  minHeight: 220,
                  borderRadius: 12,
                  background: "var(--color-surface-secondary, #f3f4f6)",
                }}
              >
                <Text.Caption>{COLUMN_LABELS[columnId]}</Text.Caption>
                <Draggable.List id={columnId} orientation="vertical" gap={8}>
                  {items[columnId].map((item, index) => (
                    <Draggable.Item key={item} id={item} index={index}>
                      <Box
                        padding={12}
                        style={{
                          borderRadius: 10,
                          background: "var(--color-surface, #fff)",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                          cursor: "grab",
                        }}
                      >
                        <Text.BodySmall>{item}</Text.BodySmall>
                      </Box>
                    </Draggable.Item>
                  ))}
                </Draggable.List>
              </Box>
            ))}
          </Box>
        </Draggable>
      </Box>

      <Box direction="column" gap={8}>
        <Text.BodySmall>Liste horizontale</Text.BodySmall>
        <Draggable
          onDragStart={() => {
            previousTags.current = [...tags];
          }}
          onDragOver={(event) => {
            setTags((current) => move(current, event));
          }}
          onDragEnd={(event) => {
            if (event.canceled) {
              setTags(previousTags.current);
            }
          }}
        >
          <Box
            padding={12}
            style={{
              borderRadius: 12,
              background: "var(--color-surface-secondary, #f3f4f6)",
            }}
          >
            <Draggable.List id="tags" orientation="horizontal" gap={8}>
              {tags.map((tag, index) => (
                <Draggable.Item key={tag} id={tag} index={index}>
                  <Badge style={{ cursor: "grab" }}>{tag}</Badge>
                </Draggable.Item>
              ))}
            </Draggable.List>
          </Box>
        </Draggable>
      </Box>
    </Box>
  );
}

function CardShowcase() {
  return (
    <Box gap={16} wrap align="stretch">
      <Card direction="column" gap={8} padding={16} style={{ width: 260 }}>
        <Text.Body>Card simple</Text.Body>
        <Text.Caption>
          Cette card se base sur Box et garde un rendu léger.
        </Text.Caption>
      </Card>

      <Card
        direction="column"
        gap={8}
        padding={16}
        shadow
        style={{ width: 260 }}
      >
        <Text.Body>Card avec shadow</Text.Body>
        <Text.Caption>
          La prop shadow ajoute une ombre pour faire ressortir le contenu.
        </Text.Caption>
      </Card>
    </Box>
  );
}

function DateInputExample() {
  const [value, setValue] = useState("");

  return (
    <Box direction="column" gap={4}>
      <DateInput
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
        placeholder="Date (ISO)"
      />
      <Text.Caption>
        currentTarget.value: {value || "—"}
      </Text.Caption>
    </Box>
  );
}

function CalendarShowcase() {
  const [singleDate, setSingleDate] = useState<Date | null>(new Date());
  const [singleWithTime, setSingleWithTime] = useState<Date | null>(
    new Date(),
  );
  const [range, setRange] = useState<CalendarRange>({
    from: null,
    to: null,
  });
  const [rangeWithTime, setRangeWithTime] = useState<CalendarRange>({
    from: null,
    to: null,
  });

  return (
    <Box direction="column" gap={24}>
      <Box direction="column" gap={8}>
        <Text.ThirdHeading as="h2">Calendar — single</Text.ThirdHeading>
        <Text.Caption>
          {singleDate
            ? format(singleDate, "d MMMM yyyy", { locale: fr })
            : "Aucune date"}
        </Text.Caption>
        <Calendar
          mode="single"
          value={singleDate}
          onDateChange={setSingleDate}
        />
      </Box>

      <Box direction="column" gap={8}>
        <Text.ThirdHeading as="h2">Calendar — single + time</Text.ThirdHeading>
        <Text.Caption>
          {singleWithTime
            ? format(singleWithTime, "d MMMM yyyy HH:mm", { locale: fr })
            : "Aucune date"}
        </Text.Caption>
        <Calendar
          mode="single"
          withTime="hh:mm"
          value={singleWithTime}
          onDateChange={setSingleWithTime}
        />
      </Box>

      <Box direction="column" gap={8}>
        <Text.ThirdHeading as="h2">Calendar — sans selects</Text.ThirdHeading>
        <Calendar mode="single" showSelects={false} defaultValue={new Date()} />
      </Box>

      <Box direction="column" gap={8}>
        <Text.ThirdHeading as="h2">Calendar — interval</Text.ThirdHeading>
        <Text.Caption>
          {range.from
            ? `${format(range.from, "d MMM yyyy", { locale: fr })}${
                range.to
                  ? ` → ${format(range.to, "d MMM yyyy", { locale: fr })}`
                  : " → …"
              }`
            : "Sélectionne une plage"}
        </Text.Caption>
        <Calendar mode="interval" value={range} onDateChange={setRange} />
      </Box>

      <Box direction="column" gap={8}>
        <Text.ThirdHeading as="h2">
          Calendar — interval + time
        </Text.ThirdHeading>
        <Text.Caption>
          {rangeWithTime.from
            ? `${format(rangeWithTime.from, "d MMM yyyy HH:mm", { locale: fr })}${
                rangeWithTime.to
                  ? ` → ${format(rangeWithTime.to, "d MMM yyyy HH:mm", { locale: fr })}`
                  : " → …"
              }`
            : "Sélectionne une plage"}
        </Text.Caption>
        <Calendar
          mode="interval"
          withTime="hh:mm"
          value={rangeWithTime}
          onDateChange={setRangeWithTime}
        />
      </Box>

      <Box direction="column" gap={8}>
        <Text.ThirdHeading as="h2">Calendar — renderDay</Text.ThirdHeading>
        <Calendar
          mode="single"
          defaultValue={new Date()}
          renderDay={(day) => (
            <button
              type="button"
              onClick={day.onClick}
              disabled={day.disabled}
              style={{
                width: "100%",
                aspectRatio: "1",
                border: "none",
                borderRadius: 10,
                cursor: day.disabled ? "not-allowed" : "pointer",
                background: day.selected
                  ? "var(--color-primary)"
                  : day.inInterval
                    ? "var(--color-primary-muted)"
                    : "transparent",
                boxShadow: day.outlined
                  ? "inset 0 0 0 1px var(--color-surface-border)"
                  : undefined,
                color: day.selected
                  ? "var(--color-primary-foreground)"
                  : day.disabled
                    ? "var(--color-foreground-muted)"
                    : "inherit",
                fontWeight: day.today ? 700 : 500,
                opacity: day.outsideMonth ? 0.45 : 1,
              }}
            >
              {day.day}
              {day.today ? "·" : ""}
            </button>
          )}
        />
      </Box>
    </Box>
  );
}

function ToastShowcase() {
  const { toast, clear } = useToast();

  return (
    <Box direction="column" gap={16}>
      <Box gap={8} wrap>
        <Button
          onClick={() =>
            toast({
              title: "Notification",
              description: "Toast par défaut",
            })
          }
        >
          Toast default
        </Button>
        <Button
          variant="success"
          onClick={() =>
            toast({
              title: "Succès",
              description: "L'action a bien été effectuée.",
              variant: "success",
            })
          }
        >
          Toast success
        </Button>
        <Button
          variant="danger"
          onClick={() =>
            toast({
              title: "Erreur",
              description: "Une erreur est survenue.",
              variant: "danger",
            })
          }
        >
          Toast danger
        </Button>
        <Button
          variant="warning"
          onClick={() =>
            toast({
              title: "Attention",
              description: "Vérifie les informations saisies.",
              variant: "warning",
            })
          }
        >
          Toast warning
        </Button>
        <Button variant="secondary" onClick={clear}>
          Clear toasts
        </Button>
      </Box>
    </Box>
  );
}

function ToolbarShowcase() {
  return (
    <Box direction="column" gap={16}>
      <Text.ThirdHeading>Toolbar</Text.ThirdHeading>
      <Text.BodySmall>
        Affiche les 2 premiers outils, puis s’étend au clic sur le chevron.
      </Text.BodySmall>
      <Box gap={16} wrap align="center">
        <Toolbar>
          <Toolbar.Item aria-label="Gras">
            <BoldIcon size={16} aria-hidden />
          </Toolbar.Item>
          <Toolbar.Item aria-label="Liste">
            <ListIcon size={16} aria-hidden />
          </Toolbar.Item>
          <Toolbar.Item aria-label="E-mail">
            <MailIcon size={16} aria-hidden />
          </Toolbar.Item>
          <Toolbar.Item aria-label="Commentaire">
            <MessageSquareIcon size={16} aria-hidden />
          </Toolbar.Item>
          <Toolbar.Item aria-label="Agrandir">
            <Maximize2Icon size={16} aria-hidden />
          </Toolbar.Item>
          <Toolbar.Item aria-label="Lien">
            <LinkIcon size={16} aria-hidden />
          </Toolbar.Item>
        </Toolbar>
        <Toolbar expandFrom="end" defaultExpanded>
          <Toolbar.Item aria-label="Gras" active>
            <BoldIcon size={16} aria-hidden />
          </Toolbar.Item>
          <Toolbar.Item aria-label="Italique">
            <ItalicIcon size={16} aria-hidden />
          </Toolbar.Item>
          <Toolbar.Item aria-label="Barré">
            <StrikethroughIcon size={16} aria-hidden />
          </Toolbar.Item>
          <Toolbar.Item aria-label="Liste">
            <ListIcon size={16} aria-hidden />
          </Toolbar.Item>
          <Toolbar.Item aria-label="Lien">
            <LinkIcon size={16} aria-hidden />
          </Toolbar.Item>
        </Toolbar>
      </Box>
    </Box>
  );
}

export default function Home() {
  return (
    <Toast>
      <Box direction="column" gap={60} padding={40}>
        <Box gap={8}>
          <Loader size="sm" />
          <Loader size="md" />
          <Loader size="lg" />
        </Box>
        <ToolbarShowcase />
        <CardShowcase />
        <CalendarShowcase />
        <SkeletonShowcase />
        <DraggableShowcase />
        <Box gap={8} wrap>
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="muted">Muted</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="outline" rounded>
            Rounded
          </Button>
          <Button variant="default" disabled>
            Disabled
          </Button>
          <Button variant="default" loading>
            Loading
          </Button>
        </Box>
        <Box direction="column" gap={16}>
          <TextInput type="text" size="sm" placeholder="Small" />
          <TextInput type="text" size="md" placeholder="Medium" />
          <TextInput type="text" size="lg" placeholder="Large" />
          <TextInput type="text" rounded placeholder="Rounded" />
          <TextInput type="text" variant="secondary" placeholder="Secondary" />
          <TextInput
            type="text"
            leftItem={<AtSignIcon size={16} />}
            placeholder="With left item"
          />
          <TextInput
            type="search"
            rightItem={<SearchIcon size={16} />}
            placeholder="With right item"
          />
          <TextInput
            type="text"
            leftItem={<AtSignIcon size={16} />}
            rightItem=".com"
            placeholder="Both sides"
          />
          <TextInput type="text" value="Disabled" disabled />
          <TextInput type="text" placeholder="Loading" loading />
          <TextInput type="password" placeholder="Password" />
          <Box gap={12} wrap align="center">
            <TimeInput format="hh:mm:ss" defaultValue={new Date()} />
            <TimeInput format="hh:mm" defaultValue={new Date()} />
            <TimeInput format="mm:ss" defaultValue={new Date()} />
            <TimeInput
              format="hh:mm"
              variant="secondary"
              defaultValue={new Date()}
            />
            <TimeInput
              format="hh:mm"
              variant="ghost"
              defaultValue={new Date()}
            />
            <TimeInput format="hh:mm" size="sm" defaultValue={new Date()} />
            <TimeInput format="hh:mm" disabled defaultValue={new Date()} />
          </Box>
          <Box direction="column" gap={8} style={{ maxWidth: 320 }}>
            <DateInputExample />
            <DateInput
              placeholder="Date et heure"
              defaultValue={new Date().toISOString()}
              calendarOptions={{ withTime: 'hh:mm' }}
            />
            <DateInput
              placeholder="Intervalle"
              calendarOptions={{
                mode: 'interval',
                withTime: 'hh:mm',
                fromYear: 2020,
                toYear: 2030,
              }}
            />
            <DateInput variant="secondary" placeholder="Secondary" />
            <DateInput disabled placeholder="Disabled" />
          </Box>
        </Box>
        <Box direction="column" gap={16}>
          <Text.Heading>Hello on Studio Sterenn</Text.Heading>
          <Text.SubHeading>Welcome to the world of AI</Text.SubHeading>
          <Text.ThirdHeading>Welcome to the world of AI</Text.ThirdHeading>
          <Text.BodyLarge>Welcome to the world of AI</Text.BodyLarge>
          <Text.Body>Welcome to the world of AI</Text.Body>
          <Text.BodySmall>Welcome to the world of AI</Text.BodySmall>
          <Text.Caption>Welcome to the world of AI</Text.Caption>
        </Box>
        <Box direction="column" gap={16}>
          <FormField label="Email" caption="Enter your email address">
            <TextInput type="email" placeholder="Email" />
          </FormField>
          <FormField label="Password" caption="Enter your password">
            <TextInput type="password" placeholder="Password" />
          </FormField>
          <FormField label="Confirm Password" error="Passwords do not match">
            <TextInput type="password" placeholder="Confirm Password" />
          </FormField>
          <FormField label="Code 2FA" caption="Entrez le code reçu">
            <OTPInput autoFocus />
          </FormField>
          <FormField label="OTP secondary">
            <OTPInput variant="secondary" length={4} />
          </FormField>
        </Box>
        <Box direction="column" gap={16}>
          <Box gap={16}>
            <Avatar
              src="https://github.com/shadcn.png"
              alt="John Doe"
              name="John Doe"
              size="sm"
            />
            <Avatar name="John Doe" size="sm" />
          </Box>
          <Box gap={16}>
            <Avatar
              src="https://github.com/shadcn.png"
              alt="John Doe"
              name="John Doe"
              size="md"
            />
            <Avatar name="John Doe" size="md" />
          </Box>
          <Box gap={16}>
            <Avatar
              src="https://github.com/shadcn.png"
              alt="John Doe"
              name="John Doe"
              size="lg"
            />
            <Avatar name="John Doe" size="lg" />
          </Box>
        </Box>
        <Box direction="column" gap={16}>
          <Dropdown trigger={<Avatar name="Jane Doe" />} align="start" rounded>
            <Dropdown.Item>Profil</Dropdown.Item>
            <Dropdown.Subsection label="Paramètres">
              <Dropdown.Item>Compte</Dropdown.Item>
              <Dropdown.Item>Facturation</Dropdown.Item>
            </Dropdown.Subsection>
            <Dropdown.Item variant="danger">Déconnexion</Dropdown.Item>
          </Dropdown>
          <Dropdown trigger={<Avatar name="Jane Doe" />} align="start" rounded>
            <Dropdown.Item>Profil</Dropdown.Item>
            <Dropdown.Section label="Paramètres">
              <Dropdown.Item>Compte</Dropdown.Item>
              <Dropdown.Item>Facturation</Dropdown.Item>
            </Dropdown.Section>
            <Dropdown.Item variant="danger">Déconnexion</Dropdown.Item>
          </Dropdown>
        </Box>
        <Box direction="column" gap={16}>
          <Select placeholder="Langue" defaultValue="fr" align="start">
            <Select.Item value="fr">Français</Select.Item>
            <Select.Item value="en">English</Select.Item>
            <Select.Section label="Autres">
              <Select.Item value="es">Español</Select.Item>
              <Select.Item value="de">Deutsch</Select.Item>
            </Select.Section>
          </Select>
          <Select
            placeholder="Fruit"
            defaultValue="pomme"
            align="start"
            searchable
            footer={
              <Button size="sm" variant="ghost">
                Ajouter un fruit
              </Button>
            }
          >
            <Select.Item value="pomme">Pomme</Select.Item>
            <Select.Item value="banane">Banane</Select.Item>
            <Select.Item value="orange">Orange</Select.Item>
            <Select.Item value="fraise">Fraise</Select.Item>
            <Select.Item value="raisin">Raisin</Select.Item>
            <Select.Item value="mangue">Mangue</Select.Item>
            <Select.Item value="ananas">Ananas</Select.Item>
            <Select.Item value="kiwi">Kiwi</Select.Item>
            <Select.Item value="poire">Poire</Select.Item>
            <Select.Item value="peche">Pêche</Select.Item>
            <Select.Item value="cerise">Cerise</Select.Item>
            <Select.Item value="pasteque">Pastèque</Select.Item>
            <Select.Item value="melon">Melon</Select.Item>
            <Select.Item value="framboise">Framboise</Select.Item>
            <Select.Item value="myrtille">Myrtille</Select.Item>
            <Select.Item value="citron">Citron</Select.Item>
            <Select.Item value="abricot">Abricot</Select.Item>
            <Select.Item value="prune">Prune</Select.Item>
            <Select.Item value="figue">Figue</Select.Item>
            <Select.Item value="grenade">Grenade</Select.Item>
          </Select>
        </Box>
        <Box direction="column" gap={16}>
          <Box gap={8} wrap>
            <Modal
              trigger={<Button>Modal center</Button>}
              title="Modal centrée"
              placement="center"
              footer={({ close }) => (
                <>
                  <Button variant="outline" onClick={close}>
                    Annuler
                  </Button>
                  <Button onClick={close}>Enregistrer</Button>
                </>
              )}
            >
              <Box direction="column" gap={16}>
                <Text.Body>
                  Cette modal est centrée avec une largeur relative a l'écran.
                </Text.Body>
                <TextInput placeholder="Nom du projet" />
              </Box>
            </Modal>
            <Modal
              trigger={<Button variant="secondary">Modal left</Button>}
              title="Drawer gauche"
              placement="left"
              footer={({ close }) => (
                <>
                  <Button variant="outline" onClick={close}>
                    Annuler
                  </Button>
                  <Button onClick={close}>Appliquer</Button>
                </>
              )}
            >
              <Box direction="column" gap={16}>
                <Text.Body>
                  Cette variante se comporte comme un drawer qui arrive depuis la
                  gauche.
                </Text.Body>
                <TextInput placeholder="Rechercher" />
                <TextInput placeholder="Filtre" />
              </Box>
            </Modal>
            <Modal
              trigger={<Button variant="outline">Modal right</Button>}
              title="Drawer droite"
              placement="right"
              footer={({ close }) => (
                <>
                  <Button variant="outline" onClick={close}>
                    Annuler
                  </Button>
                  <Button variant="success" onClick={close}>
                    Confirmer
                  </Button>
                </>
              )}
            >
              <Box direction="column" gap={16}>
                <Text.Body>
                  Cette variante ouvre un panneau latéral depuis la droite.
                </Text.Body>
                <Badge variant="secondary">Nouveau</Badge>
              </Box>
            </Modal>
            <Modal
              trigger={<Button variant="ghost">Modal no fill</Button>}
              title="Modal sans fill"
              placement="center"
              fill={false}
              footer={({ close }) => (
                <>
                  <Button variant="outline" onClick={close}>
                    Annuler
                  </Button>
                  <Button onClick={close}>Valider</Button>
                </>
              )}
            >
              <Box direction="column" gap={12}>
                <Text.Body>
                  Avec <code>fill=false</code>, la hauteur suit le contenu.
                </Text.Body>
                <Separator />
                <Text.Caption>Contenu compact</Text.Caption>
              </Box>
            </Modal>
            <ValidateActionDialog
              trigger={<Button variant="secondary">Confirmer une action</Button>}
              title="Confirmer l’enregistrement"
              description="Souhaitez-vous enregistrer ces modifications ?"
              validateLabel="Enregistrer"
              cancelLabel="Pas maintenant"
              onValidate={() => {
                console.log("validated");
              }}
            />
            <ValidateActionDialog
              critical
              trigger={<Button variant="danger">Action critique</Button>}
              title="Supprimer le projet ?"
              description="Cette action est irréversible. Toutes les données associées seront perdues."
              validateLabel="Supprimer"
              cancelLabel="Conserver"
              onValidate={async () => {
                await new Promise((resolve) => setTimeout(resolve, 400));
                console.log("deleted");
              }}
            />
             <ValidateActionDialog
              critical
              criticalVariant="warning"
              trigger={<Button variant="warning">Archiver</Button>}
              title="Êtes-vous sûr de vouloir archiver cette tâche ?"
              description="Cette action est irréversible. La tâche sera archivée et ne sera plus visible dans la liste des tâches."
              validateLabel="Archiver"
              cancelLabel="Annuler"
              onValidate={async () => {
                await new Promise((resolve) => setTimeout(resolve, 400));
                console.log("marked as archived");
              }}
            />
          </Box>
        </Box>
        <ToastShowcase />
        <Box direction="column" gap={24}>
          <Tabs defaultValue="overview" variant="default">
            <Tabs.Item value="overview">Vue d&apos;ensemble</Tabs.Item>
            <Tabs.Item value="members">Membres</Tabs.Item>
            <Tabs.Item value="settings">Paramètres</Tabs.Item>
          </Tabs>
          <Tabs defaultValue="overview" variant="secondary">
            <Tabs.Item value="overview">Vue d&apos;ensemble</Tabs.Item>
            <Tabs.Item value="members">Membres</Tabs.Item>
            <Tabs.Item value="settings">Paramètres</Tabs.Item>
          </Tabs>
          <Tabs defaultValue="sm" size="sm">
            <Tabs.Item value="sm">Small</Tabs.Item>
            <Tabs.Item value="md">Medium</Tabs.Item>
            <Tabs.Item value="lg">Large</Tabs.Item>
          </Tabs>
          <Tabs defaultValue="a" fullWidth>
            <Tabs.Item value="a">Onglet A</Tabs.Item>
            <Tabs.Item value="b">Onglet B</Tabs.Item>
            <Tabs.Item value="c">Onglet C</Tabs.Item>
          </Tabs>
        </Box>
        <Box gap={16} align="center" wrap>
          <Switch size="sm">Small</Switch>
          <Switch defaultChecked>Medium</Switch>
          <Switch size="lg">Large</Switch>
          <Switch disabled>Disabled</Switch>
          <Switch disabled defaultChecked>
            Disabled on
          </Switch>
        </Box>
        <Box gap={8} wrap>
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge size="sm">Small</Badge>
          <Badge size="lg">Large</Badge>
          <Badge rounded>Rounded</Badge>
        </Box>
        <Box direction="column" gap={16}>
          <Separator label="ou" />
          <Separator label="Suite" left={false} />
          <Separator right={false} label="Début" />
        </Box>
      </Box>
    </Toast>
  );
}
