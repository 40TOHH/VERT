<script lang="ts">
	import Panel from "$lib/components/visual/Panel.svelte";
	import { m } from "$lib/paraglide/messages";
	import { MessageCircleQuestionIcon, ShieldCheckIcon, HardDriveIcon, SmartphoneIcon, SettingsIcon, ZapIcon, ServerIcon, Image as ImageIcon, AudioLines, FilmIcon, BookText, CheckCircleIcon } from "lucide-svelte";
</script>

<div class="flex flex-col h-full items-center">
	<h1 class="hidden md:block text-[40px] tracking-tight leading-[72px] mb-6">
		<MessageCircleQuestionIcon size="40" class="inline-block -mt-2 mr-2 text-accent-purple" />
		{m["faq.title"]()}
	</h1>

	<div class="w-full max-w-[1280px] flex flex-col gap-6 p-4 md:px-4 md:py-0">
		<Panel class="p-6 flex flex-col md:flex-row items-start gap-4">
			<div class="p-3 rounded-full bg-accent-blue text-on-accent">
				<CheckCircleIcon size="24" />
			</div>
			<div class="flex-1">
				<h2 class="text-xl font-bold mb-2">{m["faq.questions.is_free.question"]()}</h2>
				<p class="text-lg">{m["faq.questions.is_free.answer"]()}</p>
			</div>
		</Panel>

		<Panel class="p-6 flex flex-col md:flex-row items-start gap-4">
			<div class="p-3 rounded-full bg-accent-purple text-on-accent">
				<ShieldCheckIcon size="24" />
			</div>
			<div class="flex-1">
				<h2 class="text-xl font-bold mb-2">{m["faq.questions.is_safe.question"]()}</h2>
				<p class="text-lg">{m["faq.questions.is_safe.answer"]()}</p>
			</div>
		</Panel>

		<Panel class="p-6 flex flex-col md:flex-row items-start gap-4">
			<div class="p-3 rounded-full bg-accent-green text-on-accent">
				<HardDriveIcon size="24" />
			</div>
			<div class="flex-1">
				<h2 class="text-xl font-bold mb-2">{m["faq.questions.formats_supported.question"]()}</h2>
				<p class="text-lg">{m["faq.questions.formats_supported.answer"]()}</p>
			</div>
		</Panel>

		<Panel class="p-6 flex flex-col md:flex-row items-start gap-4">
			<div class="p-3 rounded-full bg-accent-red text-on-accent">
				<ZapIcon size="24" />
			</div>
			<div class="flex-1">
				<h2 class="text-xl font-bold mb-2">{m["faq.questions.file_size_limit.question"]()}</h2>
				<p class="text-lg">{m["faq.questions.file_size_limit.answer"]()}</p>
			</div>
		</Panel>

		<Panel class="p-6 flex flex-col md:flex-row items-start gap-4">
			<div class="p-3 rounded-full bg-accent-blue text-on-accent">
				<SettingsIcon size="24" />
			</div>
			<div class="flex-1">
				<h2 class="text-xl font-bold mb-2">{m["faq.questions.registration_required.question"]()}</h2>
				<p class="text-lg">{m["faq.questions.registration_required.answer"]()}</p>
			</div>
		</Panel>

		<Panel class="p-6 flex flex-col md:flex-row items-start gap-4">
			<div class="p-3 rounded-full bg-accent-purple text-on-accent">
				<SmartphoneIcon size="24" />
			</div>
			<div class="flex-1">
				<h2 class="text-xl font-bold mb-2">{m["faq.questions.mobile_compatible.question"]()}</h2>
				<p class="text-lg">{m["faq.questions.mobile_compatible.answer"]()}</p>
			</div>
		</Panel>

		<Panel class="p-6 flex flex-col md:flex-row items-start gap-4">
			<div class="p-3 rounded-full bg-accent-green text-on-accent">
				<ServerIcon size="24" />
			</div>
			<div class="flex-1">
				<h2 class="text-xl font-bold mb-2">{m["faq.questions.why_video_server.question"]()}</h2>
				<p class="text-lg">{m["faq.questions.why_video_server.answer"]()}</p>
			</div>
		</Panel>

		<Panel class="p-6 flex flex-col md:flex-row items-start gap-4">
			<div class="p-3 rounded-full bg-accent-red text-on-accent">
				<ZapIcon size="24" />
			</div>
			<div class="flex-1">
				<h2 class="text-xl font-bold mb-2">{m["faq.questions.quality_loss.question"]()}</h2>
				<p class="text-lg">{m["faq.questions.quality_loss.answer"]()}</p>
			</div>
		</Panel>

		<Panel class="p-6 flex flex-col md:flex-row items-start gap-4">
			<div class="p-3 rounded-full bg-accent-blue text-on-accent">
				<CheckCircleIcon size="24" />
			</div>
			<div class="flex-1">
				<h2 class="text-xl font-bold mb-2">{m["faq.questions.supported_browsers.question"]()}</h2>
				<p class="text-lg">{m["faq.questions.supported_browsers.answer"]()}</p>
			</div>
		</Panel>

		<Panel class="p-6 flex flex-col md:flex-row items-start gap-4">
			<div class="p-3 rounded-full bg-accent-purple text-on-accent">
				<CheckCircleIcon size="24" />
			</div>
			<div class="flex-1">
				<h2 class="text-xl font-bold mb-2">{m["faq.questions.batch_conversion.question"]()}</h2>
				<p class="text-lg">{m["faq.questions.batch_conversion.answer"]()}</p>
			</div>
		</Panel>

		<Panel class="p-6 flex flex-col md:flex-row items-start gap-4">
			<div class="p-3 rounded-full bg-accent-green text-on-accent">
				<HardDriveIcon size="24" />
			</div>
			<div class="flex-1">
				<h2 class="text-xl font-bold mb-2">{m["faq.questions.metadata_preserved.question"]()}</h2>
				<p class="text-lg">{m["faq.questions.metadata_preserved.answer"]()}</p>
			</div>
		</Panel>

		<Panel class="p-6 flex flex-col md:flex-row items-start gap-4">
			<div class="p-3 rounded-full bg-accent-red text-on-accent">
				<ZapIcon size="24" />
			</div>
			<div class="flex-1">
				<h2 class="text-xl font-bold mb-2">{m["faq.questions.why_faster.question"]()}</h2>
				<p class="text-lg">{m["faq.questions.why_faster.answer"]()}</p>
			</div>
		</Panel>
	</div>
</div>