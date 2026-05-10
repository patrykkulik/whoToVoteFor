/**
 * 2024 General Election manifesto dataset (v1 — hand-curated bootstrap).
 *
 * EVERY stance in this file is `source: "curated"`. Quotes are concise
 * curator-written *summaries* of each party's published 2024 manifesto position,
 * NOT verbatim PDF substrings. Page numbers are omitted (set to 0) and the
 * runtime hides page citations for `curated` stances.
 *
 * The build-time pipeline (see DESIGN.md) will progressively replace these
 * entries with `source: "pipeline"` stances containing verbatim,
 * mechanically-verified quotes and real page numbers.
 *
 * Inaccuracies should be reported via the link on /about. The schema
 * (src/data/schema.ts) is enforced at build time and in unit tests.
 */
import type { Manifesto, PartyId, Stance } from "../schema";

const PARTIES: Record<PartyId, Manifesto["parties"][PartyId]> = {
  labour: {
    id: "labour",
    name: "Labour Party",
    shortName: "Labour",
    colour: "#E4003B",
    manifestoUrl: "https://labour.org.uk/change/",
    standingIn: ["england", "scotland", "wales"],
  },
  conservative: {
    id: "conservative",
    name: "Conservative Party",
    shortName: "Conservative",
    colour: "#0087DC",
    manifestoUrl: "https://www.conservatives.com/our-plan",
    standingIn: ["england", "scotland", "wales"],
  },
  libdem: {
    id: "libdem",
    name: "Liberal Democrats",
    shortName: "Lib Dem",
    colour: "#FAA61A",
    manifestoUrl: "https://www.libdems.org.uk/manifesto",
    standingIn: ["england", "scotland", "wales"],
  },
  green: {
    id: "green",
    name: "Green Party of England and Wales",
    shortName: "Green",
    colour: "#02A95B",
    manifestoUrl: "https://greenparty.org.uk/about/our-manifesto/",
    standingIn: ["england", "wales"],
  },
  reform: {
    id: "reform",
    name: "Reform UK",
    shortName: "Reform",
    colour: "#12B6CF",
    manifestoUrl: "https://www.reformparty.uk/policies",
    standingIn: ["england", "scotland", "wales"],
  },
  snp: {
    id: "snp",
    name: "Scottish National Party",
    shortName: "SNP",
    colour: "#FDF38E",
    manifestoUrl: "https://www.snp.org/general-election-2024/",
    standingIn: ["scotland"],
  },
};

const TOPICS: Manifesto["topics"] = {
  nhs: {
    id: "nhs",
    label: "NHS & Health",
    blurb: "Funding, staffing, social care and the role of private provision.",
    icon: "Heart",
  },
  economy: {
    id: "economy",
    label: "Economy & Tax",
    blurb: "Tax, growth, business and the UK's relationship with the EU single market.",
    icon: "PoundSterling",
  },
  education: {
    id: "education",
    label: "Education",
    blurb: "Schools, tuition fees, teacher recruitment and private schools.",
    icon: "GraduationCap",
  },
  housing: {
    id: "housing",
    label: "Housing",
    blurb: "Housebuilding targets, renters' rights and the right to buy.",
    icon: "Home",
  },
  immigration: {
    id: "immigration",
    label: "Immigration",
    blurb: "Asylum policy, migration numbers and the Rwanda scheme.",
    icon: "Globe",
  },
  environment: {
    id: "environment",
    label: "Environment & Climate",
    blurb: "Net zero, fossil fuel licences and renewable energy.",
    icon: "Leaf",
  },
  crime: {
    id: "crime",
    label: "Crime & Justice",
    blurb: "Police numbers, sentencing and drug policy.",
    icon: "Shield",
  },
  foreign: {
    id: "foreign",
    label: "Foreign Policy & Defence",
    blurb: "Defence spending, NATO, Trident and recognition of Palestine.",
    icon: "Flag",
  },
  welfare: {
    id: "welfare",
    label: "Welfare & Pensions",
    blurb: "Benefits, the two-child cap and the state pension triple lock.",
    icon: "Wallet",
  },
  transport: {
    id: "transport",
    label: "Transport",
    blurb: "Rail ownership, HS2 and the petrol car ban.",
    icon: "Train",
  },
  democracy: {
    id: "democracy",
    label: "Democracy & Constitution",
    blurb: "Voting reform, votes at 16 and reform of the House of Lords.",
    icon: "Vote",
  },
};

// Helper: build a `stated` curated stance.
const s = (
  score: -2 | -1 | 0 | 1 | 2,
  quote: string,
  confidence = 0.85,
): Stance => ({
  kind: "stated",
  score,
  citations: [{ quote, printedPage: 0, pdfPage: 0 }],
  confidence,
  source: "curated",
});

// Helper: build an `unstated` curated stance.
const u = (note?: string): Stance => ({ kind: "unstated", note, source: "curated" });

const STATEMENTS: Manifesto["statements"] = [
  // ── NHS ──────────────────────────────────────────────────────────────────
  {
    id: "nhs-funding-above-inflation",
    topic: "nhs",
    text: "NHS day-to-day spending should rise above inflation each year of the next parliament.",
    stances: {
      labour: s(1, "Pledges new investment in the NHS funded by closing tax loopholes, including 40,000 extra weekly appointments."),
      conservative: s(1, "Commits to continue increasing NHS funding in real terms each year."),
      libdem: s(2, "Large NHS funding boost including £8.4bn for staff and waiting-list reduction."),
      green: s(2, "Calls for an additional £8bn per year for the NHS rising to £28bn by end of parliament."),
      reform: s(1, "Promises more NHS spending alongside tax incentives to use private healthcare."),
      snp: s(1, "Health is devolved; supports above-inflation funding via Barnett consequentials."),
    },
  },
  {
    id: "nhs-private-provision-expansion",
    topic: "nhs",
    text: "The NHS should make greater use of private healthcare providers to cut waiting lists.",
    stances: {
      labour: s(1, "Will use spare private-sector capacity to cut waiting lists in the short term."),
      conservative: s(2, "Supports continued and expanded use of independent-sector providers."),
      libdem: s(-1, "Critical of further outsourcing; prioritises NHS capacity."),
      green: s(-2, "Wants to reverse NHS privatisation and end private contracts."),
      reform: s(2, "Proposes 20% tax relief for those using private healthcare and insurance."),
      snp: s(-2, "Opposes privatisation of the NHS in Scotland."),
    },
  },
  {
    id: "nhs-social-care-cap",
    topic: "nhs",
    text: "There should be a cap on the lifetime amount any individual pays for social care.",
    stances: {
      labour: s(0, "Promises a National Care Service but no specific cost cap on care."),
      conservative: s(1, "Reiterates commitment to the £86,000 cap previously legislated."),
      libdem: s(2, "Pledges free personal care, building on the Scottish model."),
      green: s(2, "Supports free personal care for all who need it."),
      reform: u("Manifesto does not set out a clear social-care position."),
      snp: s(1, "Free personal and nursing care already in place in Scotland."),
    },
  },

  // ── Economy ──────────────────────────────────────────────────────────────
  {
    id: "economy-raise-income-tax-high-earners",
    topic: "economy",
    text: "Income tax should rise for the highest earners.",
    stances: {
      labour: s(-2, "Rules out rises in income tax, National Insurance or VAT for working people."),
      conservative: s(-2, "Promises tax cuts including a further 2p cut to National Insurance."),
      libdem: s(0, "No headline income-tax rise; would reverse some Conservative cuts to fund services."),
      green: s(2, "Proposes a wealth tax and higher income-tax rates for those earning over £150,000."),
      reform: s(-2, "Would raise the personal allowance to £20,000, cutting tax for all earners."),
      snp: s(1, "Scottish income tax already includes higher rates for top earners."),
    },
  },
  {
    id: "economy-windfall-tax-energy",
    topic: "economy",
    text: "The windfall tax on oil and gas company profits should be extended and increased.",
    stances: {
      labour: s(2, "Will extend and strengthen the Energy Profits Levy and remove its investment loopholes."),
      conservative: s(-1, "Plans to phase the levy out as prices normalise."),
      libdem: s(2, "Backs a higher windfall tax to fund household energy support."),
      green: s(2, "Supports a permanent windfall tax on fossil-fuel companies."),
      reform: s(-2, "Opposes windfall taxes; argues they deter investment."),
      snp: s(1, "Supports a windfall tax with carve-outs for North Sea reinvestment."),
    },
  },
  {
    id: "economy-rejoin-eu-single-market",
    topic: "economy",
    text: "The UK should rejoin the European Union's single market.",
    stances: {
      labour: s(-1, "No return to single market, customs union or freedom of movement; seeks a closer relationship."),
      conservative: s(-2, "Opposes any move back towards EU single market or customs union."),
      libdem: s(2, "Long-term goal of rejoining the single market as a step to EU membership."),
      green: s(2, "Supports rejoining the single market and eventual EU membership."),
      reform: s(-2, "Opposes any closer EU alignment; would scrap remaining EU-derived rules."),
      snp: s(2, "Supports rejoining the EU and the single market."),
    },
  },

  // ── Education ────────────────────────────────────────────────────────────
  {
    id: "edu-vat-on-private-schools",
    topic: "education",
    text: "VAT should be charged on private school fees to fund state education.",
    stances: {
      labour: s(2, "Will end the VAT exemption on private school fees to fund 6,500 new state-school teachers."),
      conservative: s(-2, "Opposes the policy; pledges to keep the VAT exemption."),
      libdem: s(-1, "Has criticised the policy as risking pressure on state-school places."),
      green: s(1, "Supports ending charitable status for private schools."),
      reform: s(-2, "Opposes new taxes on private education."),
      snp: u("Education is devolved; has not taken a clear UK-wide position."),
    },
  },
  {
    id: "edu-tuition-fees-abolish",
    topic: "education",
    text: "University tuition fees in England should be abolished.",
    stances: {
      labour: s(-1, "Will not abolish fees; promises a fairer repayment system."),
      conservative: s(-2, "Defends the current tuition-fee system."),
      libdem: s(0, "Will review higher-education funding without a firm abolition pledge."),
      green: s(2, "Pledges to abolish tuition fees and write off existing debt."),
      reform: u("No specific position on abolishing tuition fees."),
      snp: s(2, "Tuition is already free for Scottish-domiciled students in Scotland."),
    },
  },
  {
    id: "edu-recruit-more-teachers",
    topic: "education",
    text: "The next government should fund a major recruitment drive to add tens of thousands of new teachers.",
    stances: {
      labour: s(2, "Pledges 6,500 new expert teachers funded by ending private-school VAT exemption."),
      conservative: s(0, "Focuses on retention rather than headline recruitment numbers."),
      libdem: s(2, "Supports a tutoring guarantee and major recruitment of teachers."),
      green: s(2, "Backs significant teacher recruitment and pay rises."),
      reform: s(0, "Promises pay rises for teachers in deprived areas, no headline numerical target."),
      snp: s(1, "Scottish Government commits to maintain teacher numbers."),
    },
  },

  // ── Housing ──────────────────────────────────────────────────────────────
  {
    id: "housing-build-1-5m-homes",
    topic: "housing",
    text: "The next parliament should deliver at least 1.5 million new homes.",
    stances: {
      labour: s(2, "Sets a target of 1.5 million new homes over the next parliament with planning reform."),
      conservative: s(1, "Pledges 1.6 million new homes over the parliament."),
      libdem: s(2, "Targets 380,000 homes a year including 150,000 social homes."),
      green: s(0, "Prioritises social and council housing rather than a headline raw number."),
      reform: s(-1, "Would loosen planning but rejects centrally-imposed housing targets."),
      snp: s(1, "Backs sustained housebuilding, focused on Scottish targets."),
    },
  },
  {
    id: "housing-rent-controls",
    topic: "housing",
    text: "Local areas should be able to introduce rent controls to limit rent increases.",
    stances: {
      labour: s(-1, "Will give renters new rights but does not back rent controls."),
      conservative: s(-2, "Opposes rent controls; argues they reduce supply."),
      libdem: s(0, "Mixed; backs longer tenancies but not rent caps."),
      green: s(2, "Supports rent controls and an indefinite freeze where needed."),
      reform: s(-2, "Opposes rent controls."),
      snp: s(2, "Scottish Government has implemented rent caps and supports stronger controls."),
    },
  },
  {
    id: "housing-right-to-buy-discounts",
    topic: "housing",
    text: "Right to Buy discounts on council homes should be cut or ended.",
    stances: {
      labour: s(1, "Will review Right to Buy with reduced discounts and stronger council protections."),
      conservative: s(-1, "Wants to extend Right to Buy to housing-association tenants."),
      libdem: s(1, "Backs giving councils power to suspend Right to Buy in their areas."),
      green: s(2, "Would end Right to Buy."),
      reform: s(-1, "Supports keeping and extending Right to Buy."),
      snp: s(2, "Right to Buy was abolished in Scotland in 2016."),
    },
  },

  // ── Immigration ──────────────────────────────────────────────────────────
  {
    id: "imm-rwanda-scheme",
    topic: "immigration",
    text: "The UK government should continue with the Rwanda removals scheme.",
    stances: {
      labour: s(-2, "Will scrap the Rwanda scheme and use the funds for a new Border Security Command."),
      conservative: s(2, "Pledges to make Rwanda flights operational and expand the scheme."),
      libdem: s(-2, "Will scrap the Rwanda scheme and replace it with safe asylum routes."),
      green: s(-2, "Opposes the Rwanda scheme as inhumane."),
      reform: s(-1, "Calls Rwanda inadequate and would leave the ECHR to enable mass deportations."),
      snp: s(-2, "Opposes the Rwanda scheme entirely."),
    },
  },
  {
    id: "imm-net-migration-cap",
    topic: "immigration",
    text: "There should be a binding annual cap on net migration to the UK.",
    stances: {
      labour: s(0, "Pledges to reduce net migration but rejects a numerical cap."),
      conservative: s(1, "Promises a binding annual migration cap set by parliament."),
      libdem: s(-1, "Opposes arbitrary caps; favours an evidence-based system."),
      green: s(-2, "Opposes immigration caps."),
      reform: s(2, "Proposes a freeze on non-essential immigration to net zero."),
      snp: s(-1, "Opposes a UK-wide cap; calls for Scotland-specific powers."),
    },
  },
  {
    id: "imm-safe-asylum-routes",
    topic: "immigration",
    text: "The UK should expand safe and legal routes for asylum seekers.",
    stances: {
      labour: s(1, "Backs limited expansion of safe routes alongside enforcement."),
      conservative: s(-1, "Focused on deterrence; sceptical of expanding safe routes."),
      libdem: s(2, "Calls for new safe and legal routes including humanitarian visas."),
      green: s(2, "Supports significantly expanded safe routes."),
      reform: s(-2, "Opposes new safe routes; favours offshore processing."),
      snp: s(2, "Backs expanded safe and legal routes."),
    },
  },

  // ── Environment ──────────────────────────────────────────────────────────
  {
    id: "env-decarbonise-power-2030",
    topic: "environment",
    text: "Britain's electricity system should be fully decarbonised by 2030.",
    stances: {
      labour: s(2, "Targets clean power by 2030 via GB Energy and renewables expansion."),
      conservative: s(-1, "Backs net zero by 2050 but rejects 2030 power target as too costly."),
      libdem: s(2, "Pledges 90% renewable electricity by 2030."),
      green: s(2, "Backs full decarbonisation of the grid by 2030."),
      reform: s(-2, "Would scrap net-zero targets and renewable subsidies."),
      snp: s(2, "Backs decarbonisation of the grid in line with Scottish targets."),
    },
  },
  {
    id: "env-ban-new-oil-gas-licences",
    topic: "environment",
    text: "No new oil and gas exploration licences should be issued in the North Sea.",
    stances: {
      labour: s(2, "Will not issue new oil and gas licences; existing fields continue."),
      conservative: s(-2, "Supports new licensing rounds and annual licensing."),
      libdem: s(2, "Opposes new oil and gas licences."),
      green: s(2, "Opposes any new fossil-fuel extraction."),
      reform: s(-2, "Backs maximum extraction from the North Sea."),
      snp: s(0, "Opposes new licences without a credible climate test; cautious about jobs impact."),
    },
  },
  {
    id: "env-onshore-wind-expansion",
    topic: "environment",
    text: "The effective ban on new onshore wind in England should be lifted to allow rapid expansion.",
    stances: {
      labour: s(2, "Will lift the de-facto ban on onshore wind."),
      conservative: s(-1, "Allows onshore wind only with strong local consent."),
      libdem: s(2, "Backs lifting the ban and a major rollout of onshore wind."),
      green: s(2, "Strongly supports onshore wind expansion."),
      reform: s(-2, "Opposes onshore wind expansion."),
      snp: s(2, "Onshore wind heavily backed in Scotland."),
    },
  },

  // ── Crime ────────────────────────────────────────────────────────────────
  {
    id: "crime-more-police-officers",
    topic: "crime",
    text: "The next government should significantly increase the number of police officers.",
    stances: {
      labour: s(2, "Pledges 13,000 additional neighbourhood police and PCSOs."),
      conservative: s(1, "Highlights record officer numbers; promises continued recruitment."),
      libdem: s(1, "Backs more community police officers."),
      green: s(0, "Prefers focus on prevention over more officers."),
      reform: s(2, "Proposes recruiting 40,000 new police officers."),
      snp: s(1, "Supports maintaining and increasing police numbers in Scotland."),
    },
  },
  {
    id: "crime-tougher-sentences-violent",
    topic: "crime",
    text: "Sentences for serious violent and sexual offences should be made significantly longer.",
    stances: {
      labour: s(0, "Backs targeted sentencing reforms but not headline longer-sentence policy."),
      conservative: s(2, "Pledges life-means-life for the most serious murderers and longer sentences."),
      libdem: s(-1, "Critical of longer sentences without rehabilitation reform."),
      green: s(-2, "Opposes longer sentences; favours rehabilitation."),
      reform: s(2, "Backs significantly tougher sentences."),
      snp: s(0, "Supports targeted reform but not a general lengthening of sentences."),
    },
  },
  {
    id: "crime-decriminalise-cannabis",
    topic: "crime",
    text: "Personal possession of cannabis for adults should be decriminalised.",
    stances: {
      labour: s(-2, "Opposes decriminalisation of cannabis."),
      conservative: s(-2, "Opposes decriminalisation."),
      libdem: s(1, "Supports a regulated cannabis market."),
      green: s(2, "Supports legalising and regulating cannabis."),
      reform: s(-1, "Opposes decriminalisation."),
      snp: s(0, "Calls for drug policy reform including consumption rooms; no full decriminalisation pledge."),
    },
  },

  // ── Foreign / Defence ───────────────────────────────────────────────────
  {
    id: "foreign-defence-2-5-percent",
    topic: "foreign",
    text: "UK defence spending should rise to at least 2.5% of GDP this parliament.",
    stances: {
      labour: s(1, "Aspires to 2.5% of GDP when conditions allow."),
      conservative: s(2, "Commits to 2.5% of GDP by 2030."),
      libdem: s(1, "Backs reaching 2.5% as a long-term goal."),
      green: s(-2, "Opposes raising defence spending; favours diplomacy and aid."),
      reform: s(2, "Proposes 3% of GDP defence spending."),
      snp: s(0, "Mixed; conditional on Scottish priorities."),
    },
  },
  {
    id: "foreign-recognise-palestine",
    topic: "foreign",
    text: "The UK should formally recognise the State of Palestine.",
    stances: {
      labour: s(1, "Supports recognition of Palestine as part of a peace process."),
      conservative: s(-1, "Recognition only as part of a final settlement."),
      libdem: s(2, "Supports immediate recognition of Palestine."),
      green: s(2, "Backs recognition of Palestine."),
      reform: s(-1, "Sceptical of unilateral recognition."),
      snp: s(2, "Supports immediate recognition of Palestine."),
    },
  },
  {
    id: "foreign-renew-trident",
    topic: "foreign",
    text: "The UK should retain and renew the Trident nuclear deterrent.",
    stances: {
      labour: s(2, "Unshakeable commitment to Trident and NATO."),
      conservative: s(2, "Strongly supports Trident renewal."),
      libdem: s(2, "Supports the continuous-at-sea nuclear deterrent."),
      green: s(-2, "Opposes Trident; would scrap the nuclear deterrent."),
      reform: s(2, "Supports Trident."),
      snp: s(-2, "Opposes Trident; calls for removal from Scotland."),
    },
  },

  // ── Welfare ──────────────────────────────────────────────────────────────
  {
    id: "welfare-two-child-benefit-cap",
    topic: "welfare",
    text: "The two-child limit on benefits should be scrapped.",
    stances: {
      labour: s(0, "Will not scrap the two-child limit immediately; keeps it under review."),
      conservative: s(-2, "Defends the two-child limit."),
      libdem: s(1, "Wants to scrap the two-child limit and benefit cap."),
      green: s(2, "Will abolish the two-child limit."),
      reform: s(0, "Mixed; focuses on broader welfare reform rather than the cap specifically."),
      snp: s(2, "Calls for immediate abolition of the two-child cap."),
    },
  },
  {
    id: "welfare-pension-triple-lock",
    topic: "welfare",
    text: "The state pension triple lock should be retained.",
    stances: {
      labour: s(2, "Commits to maintaining the triple lock for the next parliament."),
      conservative: s(2, "Pledges triple lock plus, raising the personal allowance for pensioners with the state pension."),
      libdem: s(2, "Supports keeping the triple lock."),
      green: s(2, "Supports keeping and reviewing the triple lock."),
      reform: s(2, "Supports the triple lock."),
      snp: s(2, "Supports the triple lock."),
    },
  },
  {
    id: "welfare-universal-credit-uplift",
    topic: "welfare",
    text: "The basic rate of Universal Credit should be increased.",
    stances: {
      labour: s(1, "Will review Universal Credit; targeted improvements promised."),
      conservative: s(0, "Defends current Universal Credit levels."),
      libdem: s(2, "Pledges to restore the £20-a-week uplift and reform UC."),
      green: s(2, "Backs raising UC and longer-term move to Universal Basic Income."),
      reform: s(0, "Focuses on conditionality reform rather than higher rates."),
      snp: s(1, "Backs raising UC and devolving more welfare powers."),
    },
  },

  // ── Transport ────────────────────────────────────────────────────────────
  {
    id: "transport-renationalise-rail",
    topic: "transport",
    text: "Train operating companies should be brought back into public ownership.",
    stances: {
      labour: s(2, "Will bring rail operators into public ownership via Great British Railways."),
      conservative: s(-1, "Backs reformed private operation under Great British Railways."),
      libdem: s(0, "Mixed; focused on accountability rather than full nationalisation."),
      green: s(2, "Backs full public ownership of rail."),
      reform: s(-2, "Opposes nationalisation."),
      snp: s(1, "ScotRail is already in public ownership."),
    },
  },
  {
    id: "transport-hs2-northern-leg",
    topic: "transport",
    text: "The cancelled northern leg of HS2 between Birmingham and Manchester should be restored.",
    stances: {
      labour: s(-1, "Regrets the cancellation but will not commit to restoring the northern leg."),
      conservative: s(-2, "Cancelled the leg; will not restore it."),
      libdem: s(0, "No firm commitment to restore the northern leg."),
      green: s(0, "Prioritises local rail investment over HS2."),
      reform: s(-2, "Opposes HS2."),
      snp: u("No clear commitment on the HS2 northern leg."),
    },
  },
  {
    id: "transport-petrol-car-ban-2030",
    topic: "transport",
    text: "The ban on new petrol and diesel car sales should take effect in 2030.",
    stances: {
      labour: s(2, "Will restore the 2030 phase-out date for new petrol and diesel cars."),
      conservative: s(-1, "Delayed the phase-out from 2030 to 2035."),
      libdem: s(2, "Supports the 2030 phase-out date."),
      green: s(2, "Backs an earlier phase-out, by 2027 where feasible."),
      reform: s(-2, "Would scrap the petrol-car phase-out."),
      snp: s(1, "Backs phasing out new petrol and diesel cars in line with climate targets."),
    },
  },

  // ── Democracy ────────────────────────────────────────────────────────────
  {
    id: "dem-proportional-representation",
    topic: "democracy",
    text: "Westminster general elections should use a form of proportional representation.",
    stances: {
      labour: s(-1, "No commitment to PR for Westminster elections."),
      conservative: s(-2, "Opposes PR for Westminster."),
      libdem: s(2, "Long-standing supporter of proportional representation."),
      green: s(2, "Strongly supports PR."),
      reform: s(2, "Backs PR for Westminster."),
      snp: s(1, "Supports electoral reform; uses PR-style systems in Scotland."),
    },
  },
  {
    id: "dem-votes-at-16",
    topic: "democracy",
    text: "The voting age for UK elections should be lowered to 16.",
    stances: {
      labour: s(2, "Pledges votes at 16 for UK general elections."),
      conservative: s(-2, "Opposes lowering the voting age."),
      libdem: s(2, "Supports votes at 16."),
      green: s(2, "Supports votes at 16."),
      reform: s(-1, "Opposes lowering the voting age."),
      snp: s(2, "Already in place for Scottish elections; backs UK-wide change."),
    },
  },
  {
    id: "dem-replace-house-of-lords",
    topic: "democracy",
    text: "The House of Lords should be replaced with an elected second chamber.",
    stances: {
      labour: s(1, "Pledges to replace the House of Lords with an elected Assembly of the Nations and Regions."),
      conservative: s(-2, "Opposes abolition or wholesale reform."),
      libdem: s(2, "Supports an elected second chamber."),
      green: s(2, "Backs an elected second chamber."),
      reform: s(0, "Supports radical reform but not a clear elected-chamber position."),
      snp: s(2, "Backs abolition of the House of Lords."),
    },
  },
];

const manifesto2024: Manifesto = {
  electionYear: 2024,
  parties: PARTIES,
  topics: TOPICS,
  statements: STATEMENTS,
};

export default manifesto2024;
