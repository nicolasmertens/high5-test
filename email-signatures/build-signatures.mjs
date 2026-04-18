import { writeFileSync } from "fs";

const PEOPLE = [
  { slug: "alex", name: "Alex", role: "CEO" },
  { slug: "clara", name: "Clara", role: "Product Architect" },
  { slug: "oscar", name: "Oscar", role: "Engineer" },
  { slug: "leo", name: "Leo", role: "Frontend Engineer" },
  { slug: "emma", name: "Emma", role: "Head of Growth" },
  { slug: "lucas", name: "Lucas", role: "Lifecycle Agent" },
];

function render({ slug, name, role }) {
  return `<!-- 1Test.me Email Signature — ${name} -->
<table cellpadding="0" cellspacing="0" border="0" style="font-family:'Plus Jakarta Sans',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:13px;line-height:1.5;color:#78624a;max-width:440px;">
  <tr>
    <td colspan="2" style="padding:0 0 12px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr><td style="border-top:2px solid #d97706;font-size:1px;line-height:1px;">&nbsp;</td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="vertical-align:top;padding-right:14px;width:40px;">
      <table cellpadding="0" cellspacing="0" border="0" width="40" height="40">
        <tr>
          <td style="width:20px;height:20px;padding:0;"><div style="width:14px;height:14px;background-color:#f59e0b;border-radius:50%;"></div></td>
          <td style="width:20px;height:20px;padding:0;"><div style="width:14px;height:14px;background-color:#8b5cf6;border-radius:50%;"></div></td>
        </tr>
        <tr>
          <td style="width:20px;height:20px;padding:0;"><div style="width:14px;height:14px;background-color:#ef4444;border-radius:50%;"></div></td>
          <td style="width:20px;height:20px;padding:0;"><div style="width:14px;height:14px;background-color:#10b981;border-radius:50%;"></div></td>
        </tr>
      </table>
    </td>
    <td style="vertical-align:top;">
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-family:'Plus Jakarta Sans',system-ui,-apple-system,sans-serif;font-size:16px;font-weight:800;color:#1c1106;padding-bottom:2px;letter-spacing:-0.01em;">${name}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#78624a;padding-bottom:4px;">${role} · 1Test</td>
        </tr>
        <tr>
          <td style="font-size:13px;padding-bottom:2px;"><a href="https://1test.me" style="color:#b45309;text-decoration:none;font-weight:600;">1test.me</a> · <a href="mailto:${slug}@1test.me" style="color:#b45309;text-decoration:none;">${slug}@1test.me</a></td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td colspan="2" style="padding-top:10px;">
      <span style="font-size:11px;color:#a08e70;letter-spacing:0.02em;">One Test. Four Frameworks. Know Yourself.</span>
    </td>
  </tr>
</table>
`;
}

const json = {};
for (const p of PEOPLE) {
  const html = render(p);
  writeFileSync(`./email-signatures/${p.slug}.html`, html);
  json[p.slug] = html;
}
writeFileSync("./email-signatures/signatures.json", JSON.stringify(json, null, 2) + "\n");
console.log("wrote", PEOPLE.length, "signatures + signatures.json");
