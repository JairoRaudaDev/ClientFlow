-- CreateTable
CREATE TABLE "clients" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(254),
    "company" VARCHAR(120),
    "phone" VARCHAR(32),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "clients_workspace_id_idx" ON "clients"("workspace_id");

-- CreateIndex
CREATE INDEX "clients_workspace_id_created_at_idx" ON "clients"("workspace_id", "created_at");

-- CreateIndex
CREATE INDEX "clients_workspace_id_name_idx" ON "clients"("workspace_id", "name");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
